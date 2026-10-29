/*
 * Alt.Tribe inventory upload – shared settings and rules.
 *
 * 1. SCRIPT_URL: paste the Google Apps Script "Web app" URL here after setup
 *    (see inventory-system/SETUP.md). Until then the pages run in "not connected" mode.
 * 2. COLUMNS: the exact format brands must follow. Change labels/rules here and both the
 *    upload page and the downloadable template update automatically.
 */
window.INV = {
  SCRIPT_URL: "",

  SHEET_NAME: "Inventory",   // sheet read from the brand's file (falls back to the first sheet)
  MAX_ROWS: 3000,

  CATEGORIES: ["Clothing", "Jewellery", "Bags", "Skincare", "Health & Wellness", "Edibles", "Lifestyle", "Home & Decor"],

  // key: internal name · label: exact column header in the Excel · rule: how the cell is checked
  COLUMNS: [
    { key: "sku",      label: "SKU",              required: true,  type: "code",  max: 30,  unique: true,
      help: "Your product code. Letters, numbers, - and _ only. Must be unique in the file.", example: "AT-KUR-001" },
    { key: "name",     label: "Product Name",     required: true,  type: "text",  min: 3, max: 120,
      help: "Full product name as it should appear on the bill.", example: "Hand-block Cotton Kurta" },
    { key: "category", label: "Category",         required: true,  type: "oneOf", list: "CATEGORIES",
      help: "One of: Clothing, Jewellery, Bags, Skincare, Health & Wellness, Edibles, Lifestyle, Home & Decor.", example: "Clothing" },
    { key: "size",     label: "Size",             required: false, type: "text",  max: 20,
      help: "Optional. e.g. S, M, L, XL, Free Size, 250 g, 100 ml.", example: "M" },
    { key: "colour",   label: "Colour",           required: false, type: "text",  max: 30,
      help: "Optional.", example: "Indigo" },
    { key: "mrp",      label: "MRP",              required: true,  type: "money", min: 1, max: 1000000,
      help: "Number only, no Rs/₹ sign or commas. Up to 2 decimals.", example: 1499 },
    { key: "qty",      label: "Quantity",         required: true,  type: "int",   min: 1, max: 100000,
      help: "Whole number of pieces you are bringing in.", example: 6 },
    { key: "hsn",      label: "HSN Code",         required: true,  type: "digits", lengths: [4, 6, 8],
      help: "4, 6 or 8 digits.", example: "6211" },
    { key: "gst",      label: "GST %",            required: true,  type: "oneOfNum", values: [0, 3, 5, 12, 18, 28],
      help: "One of 0, 3, 5, 12, 18, 28 (number only).", example: 5 },
    { key: "barcode",  label: "Barcode",          required: false, type: "digits", lengths: [8, 12, 13, 14],
      help: "Optional. 8, 12, 13 or 14 digits.", example: "" },
  ],
};

/* ------------------------------------------------------------------ validation (shared) */
(function () {
  const INV = window.INV;
  const norm = (s) => String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]/g, "");
  const isBlank = (v) => v === null || v === undefined || String(v).trim() === "";

  function asText(v) {
    if (typeof v === "number") return Number.isInteger(v) ? String(v) : String(v);
    return String(v).trim();
  }

  function checkCell(col, raw) {
    // returns { value, error }
    if (isBlank(raw)) return col.required ? { error: "Required – this cell is empty" } : { value: "" };
    const t = asText(raw);
    switch (col.type) {
      case "text":
        if (col.min && t.length < col.min) return { error: `Too short (min ${col.min} characters)` };
        if (col.max && t.length > col.max) return { error: `Too long (max ${col.max} characters)` };
        return { value: t };
      case "code":
        if (!/^[A-Za-z0-9_-]+$/.test(t)) return { error: "Only letters, numbers, - and _ allowed (no spaces)" };
        if (col.max && t.length > col.max) return { error: `Too long (max ${col.max} characters)` };
        return { value: t };
      case "oneOf": {
        const list = INV[col.list] || [];
        const hit = list.find((x) => norm(x) === norm(t));
        if (!hit) return { error: `Must be one of: ${list.join(", ")}` };
        return { value: hit };
      }
      case "money": {
        let n = typeof raw === "number" ? raw : (/^\d+(\.\d{1,2})?$/.test(t) ? Number(t) : NaN);
        if (!Number.isFinite(n)) return { error: "Must be a plain number (no ₹, Rs or commas)" };
        if (Math.round(n * 100) !== n * 100 && Math.abs(Math.round(n * 100) - n * 100) > 1e-6) return { error: "Max 2 decimal places" };
        if (n < col.min || n > col.max) return { error: `Must be between ${col.min} and ${col.max}` };
        return { value: Math.round(n * 100) / 100 };
      }
      case "int": {
        const n = typeof raw === "number" ? raw : (/^\d+$/.test(t) ? Number(t) : NaN);
        if (!Number.isInteger(n)) return { error: "Must be a whole number" };
        if (n < col.min || n > col.max) return { error: `Must be between ${col.min} and ${col.max}` };
        return { value: n };
      }
      case "digits": {
        const d = typeof raw === "number" && Number.isInteger(raw) ? String(raw) : t;
        if (!/^\d+$/.test(d)) return { error: "Digits only" };
        if (col.lengths && !col.lengths.includes(d.length)) return { error: `Must be ${col.lengths.join(", ")} digits long` };
        return { value: d };
      }
      case "oneOfNum": {
        const n = typeof raw === "number" ? raw : (/^\d+(\.\d+)?$/.test(t.replace(/%$/, "")) ? Number(t.replace(/%$/, "")) : NaN);
        if (!col.values.includes(n)) return { error: `Must be one of ${col.values.join(", ")}` };
        return { value: n };
      }
    }
    return { value: t };
  }

  /**
   * rows: array of arrays (first row = headers) as read from the sheet.
   * returns { ok, errors:[{row,column,message,value}], products:[{...}], summary:{products,units,value} }
   */
  INV.validate = function (rows) {
    const errors = [];
    const add = (row, column, message, value) => errors.push({ row, column, message, value: value == null ? "" : String(value) });
    if (!rows || !rows.length) { add("-", "-", "The sheet is empty"); return { ok: false, errors, products: [], summary: null }; }

    // headers
    const header = rows[0].map((h) => asText(h == null ? "" : h));
    const byNorm = {};
    INV.COLUMNS.forEach((c) => (byNorm[norm(c.label)] = c));
    const colIndex = {};
    header.forEach((h, i) => {
      if (isBlank(h)) return;
      const c = byNorm[norm(h)];
      if (!c) { add(1, h, "Unexpected column – please use the template's columns only"); return; }
      if (colIndex[c.key] !== undefined) { add(1, h, "This column appears twice"); return; }
      colIndex[c.key] = i;
    });
    INV.COLUMNS.forEach((c) => { if (colIndex[c.key] === undefined) add(1, c.label, "Missing column – add it exactly as in the template"); });
    if (errors.length) return { ok: false, errors, products: [], summary: null };

    // body
    const products = [];
    const seen = {};
    let count = 0;
    for (let r = 1; r < rows.length; r++) {
      const line = rows[r] || [];
      if (INV.COLUMNS.every((c) => isBlank(line[colIndex[c.key]]))) continue; // skip empty lines
      count++;
      if (count > INV.MAX_ROWS) { add(r + 1, "-", `Too many products – max ${INV.MAX_ROWS} per file`); break; }
      const p = {};
      INV.COLUMNS.forEach((c) => {
        const raw = line[colIndex[c.key]];
        const res = checkCell(c, raw);
        if (res.error) add(r + 1, c.label, res.error, raw);
        else p[c.key] = res.value;
        if (c.unique && !res.error && res.value !== "") {
          const k = norm(res.value);
          if (seen[k]) add(r + 1, c.label, `Duplicate – same ${c.label} as row ${seen[k]}`, raw);
          else seen[k] = r + 1;
        }
      });
      p._row = r + 1;
      products.push(p);
    }
    if (!count) add(2, "-", "No products found under the header row");

    const summary = {
      products: products.length,
      units: products.reduce((s, p) => s + (p.qty || 0), 0),
      value: Math.round(products.reduce((s, p) => s + (p.mrp || 0) * (p.qty || 0), 0) * 100) / 100,
    };
    return { ok: errors.length === 0, errors, products, summary };
  };

  INV.formatINR = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

  INV.call = async function (payload) {
    if (!INV.SCRIPT_URL) throw new Error("NOT_CONNECTED");
    const res = await fetch(INV.SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // simple request, no CORS preflight
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Request failed");
    return data;
  };
})();
