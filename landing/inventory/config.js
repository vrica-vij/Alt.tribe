/*
 * Alt.Tribe inventory upload – shared settings and rules.
 *
 * 1. SCRIPT_URL: paste the Google Apps Script "Web app" URL here after setup
 *    (see inventory-system/SETUP.md). Until then the pages run in "not connected" mode.
 * 2. COLUMNS / ROW_RULES: the exact format brands must follow (Alt.Tribe Zoho item format).
 *    Change them here and the upload page, its rules table and the template all update.
 */
window.INV = {
  SCRIPT_URL: "",

  MAX_ROWS: 3000,
  // which columns feed the totals shown to brands and logged on approval
  QTY_KEY: "stock",
  PRICE_KEY: "selling",

  // key: internal name · label: exact column header · rule: how the cell is checked
  COLUMNS: [
    { key: "name",        label: "Product Name",         required: true,  type: "text", unique: true,
      help: "Required. Must be unique in the file – add colour/size to the name to tell variants apart.", example: "Marigold Ecoprinted Pure Silk Tie" },
    { key: "unit",        label: "Unit",                 required: true,  type: "fixed", values: ["Pcs"],
      help: "Always Pcs. (Do not put the quantity here – that goes in Opening Stock.)", example: "Pcs" },
    { key: "desc",        label: "Description",          required: false, type: "text", max: 500,
      help: "Optional. Up to 500 characters.", example: "Hand ecoprinted with marigold and eucalyptus on pure silk" },
    { key: "brand",       label: "Brand",                required: true,  type: "text", sameAll: true,
      help: "Required. Your brand name, written the same way in every row.", example: "Kokikar" },
    { key: "itemType",    label: "Item Type",            required: true,  type: "fixed", values: ["Inventory"],
      help: "Always Inventory.", example: "Inventory" },
    { key: "productType", label: "Product Type",         required: true,  type: "fixed", values: ["Goods"],
      help: "Always Goods. (Not the material – Silk, Cotton etc. go in the name or description.)", example: "Goods" },
    { key: "purchase",    label: "Purchase Price",       required: true,  type: "money", min: 0.01, max: 1000000,
      help: "Required. Price excluding GST. Number only – no ₹ sign or commas. Must be the same as Selling Price.", example: 1800 },
    { key: "selling",     label: "Selling Price",        required: true,  type: "money", min: 0.01, max: 1000000,
      help: "Required. Price excluding GST. Number only. Must be the same as Purchase Price.", example: 1800 },
    { key: "sku",         label: "SKU",                  required: true,  type: "code", max: 40, unique: true,
      help: "Required. Unique product code – letters, numbers, - and _ only, no spaces.", example: "KOK-TIE-001" },
    { key: "stock",       label: "Opening Stock",        required: true,  type: "int", min: 1, max: 100000,
      help: "Required. Number of pieces you are bringing in – a whole number, at least 1.", example: 2 },
    { key: "hsn",         label: "HSN/SAC",              required: false, type: "digits",
      help: "Optional. Digits only.", example: "62152000" },
    { key: "intraName",   label: "Intra State Tax Name", required: true,  type: "fixed", values: ["GST0", "GST3", "GST5", "GST18"],
      help: "One of GST0, GST3, GST5, GST18 – must match the Intra State Tax Rate (e.g. GST5 with 5).", example: "GST5" },
    { key: "intraRate",   label: "Intra State Tax Rate", required: true,  type: "oneOfNum", values: [0, 3, 5, 18],
      help: "One of 0, 3, 5, 18 (number only).", example: 5 },
    { key: "intraType",   label: "Intra State Tax Type", required: true,  type: "fixed", values: ["Group"],
      help: "Always Group.", example: "Group" },
    { key: "interName",   label: "Inter State Tax Name", required: true,  type: "fixed", values: ["IGST0", "IGST3", "IGST5", "IGST18"],
      help: "One of IGST0, IGST3, IGST5, IGST18 – must match the Inter State Tax Rate (e.g. IGST5 with 5).", example: "IGST5" },
    { key: "interRate",   label: "Inter State Tax Rate", required: true,  type: "oneOfNum", values: [0, 3, 5, 18],
      help: "One of 0, 3, 5, 18 – must be the same as the Intra State Tax Rate.", example: 5 },
    { key: "interType",   label: "Inter State Tax Type", required: true,  type: "fixed", values: ["Simple"],
      help: "Always Simple.", example: "Simple" },
  ],

  // checks that compare columns within a row: return an error message, or "" if fine
  ROW_RULES: [
    { column: "Selling Price", check: (p) => p.purchase !== undefined && p.selling !== undefined && p.purchase !== p.selling
        ? `Must be the same as Purchase Price (${p.purchase})` : "" },
    { column: "Intra State Tax Name", check: (p) => p.intraName && p.intraRate !== undefined && p.intraName !== "GST" + p.intraRate
        ? `Doesn't match the Intra rate ${p.intraRate} – should be GST${p.intraRate}` : "" },
    { column: "Inter State Tax Name", check: (p) => p.interName && p.interRate !== undefined && p.interName !== "IGST" + p.interRate
        ? `Doesn't match the Inter rate ${p.interRate} – should be IGST${p.interRate}` : "" },
    { column: "Inter State Tax Rate", check: (p) => p.intraRate !== undefined && p.interRate !== undefined && p.intraRate !== p.interRate
        ? `Must be the same as the Intra State Tax Rate (${p.intraRate})` : "" },
  ],
};

/* ------------------------------------------------------------------ validation (shared) */
(function () {
  const INV = window.INV;
  const norm = (s) => String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]/g, "");
  const isBlank = (v) => v === null || v === undefined || String(v).trim() === "";
  const asText = (v) => (typeof v === "number" ? String(v) : String(v).trim());

  function checkCell(col, raw) {
    // returns { value } or { error }
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
      case "fixed": {
        const hit = col.values.find((x) => norm(x) === norm(t));
        if (!hit) return { error: col.values.length === 1 ? `Must be "${col.values[0]}"` : `Must be one of: ${col.values.join(", ")}` };
        return { value: hit };
      }
      case "money": {
        const n = typeof raw === "number" ? raw : (/^\d+(\.\d{1,2})?$/.test(t) ? Number(t) : NaN);
        if (!Number.isFinite(n)) return { error: "Must be a plain number (no ₹, Rs or commas)" };
        if (Math.abs(n * 100 - Math.round(n * 100)) > 1e-6) return { error: "Max 2 decimal places" };
        if (n < col.min || n > col.max) return { error: `Must be more than 0 and at most ${col.max}` };
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
        const s = t.replace(/%$/, "");
        const n = typeof raw === "number" ? raw : (/^\d+(\.\d+)?$/.test(s) ? Number(s) : NaN);
        if (!col.values.includes(n)) return { error: `Must be one of ${col.values.join(", ")}` };
        return { value: n };
      }
    }
    return { value: t };
  }

  /**
   * rows: array of arrays from the FIRST sheet (row 1 = headers).
   * returns { ok, errors:[{row,column,message,value}], products:[{...}], summary:{products,units,value,brand} }
   */
  INV.validate = function (rows) {
    const errors = [];
    const add = (row, column, message, value) => errors.push({ row, column, message, value: value == null ? "" : String(value) });
    if (!rows || !rows.length) { add("-", "-", "The sheet is empty"); return { ok: false, errors, products: [], summary: null }; }

    // headers (spaces/capitals/punctuation ignored, so " Intra State Tax Type" still matches)
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

    // columns whose value is pre-filled in the template don't make a row "real" on their own
    const fixedKeys = new Set(INV.COLUMNS.filter((c) => c.type === "fixed" && c.values.length === 1).map((c) => c.key));
    const products = [];
    const seen = {};      // unique columns
    let firstSame = {};   // sameAll columns
    let count = 0;
    for (let r = 1; r < rows.length; r++) {
      const line = rows[r] || [];
      const filled = INV.COLUMNS.filter((c) => !fixedKeys.has(c.key) && !isBlank(line[colIndex[c.key]]));
      if (!filled.length) continue; // empty (or only pre-filled) line
      count++;
      if (count > INV.MAX_ROWS) { add(r + 1, "-", `Too many products – max ${INV.MAX_ROWS} per file`); break; }
      const p = {};
      INV.COLUMNS.forEach((c) => {
        const raw = line[colIndex[c.key]];
        const res = checkCell(c, raw);
        if (res.error) { add(r + 1, c.label, res.error, raw); return; }
        p[c.key] = res.value;
        if (res.value === "") return;
        if (c.unique) {
          seen[c.key] = seen[c.key] || {};
          const k = norm(res.value);
          if (seen[c.key][k]) add(r + 1, c.label, `Duplicate – same ${c.label} as row ${seen[c.key][k]}`, raw);
          else seen[c.key][k] = r + 1;
        }
        if (c.sameAll) {
          if (!firstSame[c.key]) firstSame[c.key] = { v: res.value, row: r + 1 };
          else if (norm(firstSame[c.key].v) !== norm(res.value))
            add(r + 1, c.label, `Must be the same in every row – row ${firstSame[c.key].row} says "${firstSame[c.key].v}"`, raw);
        }
      });
      INV.ROW_RULES.forEach((rule) => {
        const msg = rule.check(p);
        if (msg) add(r + 1, rule.column, msg, "");
      });
      p._row = r + 1;
      products.push(p);
    }
    if (!count) add(2, "-", "No products found under the header row");

    const q = INV.QTY_KEY, pr = INV.PRICE_KEY;
    const summary = {
      products: products.length,
      units: products.reduce((s, p) => s + (p[q] || 0), 0),
      value: Math.round(products.reduce((s, p) => s + (p[pr] || 0) * (p[q] || 0), 0) * 100) / 100,
      brand: products[0] && products[0].brand ? products[0].brand : "",
    };
    return { ok: errors.length === 0, errors, products, summary };
  };

  INV.isMoney = (key) => (INV.COLUMNS.find((c) => c.key === key) || {}).type === "money";
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
