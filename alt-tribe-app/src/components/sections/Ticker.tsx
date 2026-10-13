const ITEMS = [
  'You build the brand. We handle the retail.',
  '600+ Brands worked with',
  '100+ Brands currently in our ecosystem',
  '8+ Categories',
]

/**
 * Band under the hero: the lines drift left in a continuous loop. The set
 * is rendered twice and the track slides by exactly one set (-50%), so the
 * loop has no seam. The copy is hidden from screen readers, and viewers who
 * asked for reduced motion get the lines standing still.
 */
export function Ticker() {
  return (
    <section className="ticker" aria-label="Alt.Tribe at a glance">
      <div className="ticker__track">
        {[false, true].map((clone) => (
          <ul key={String(clone)} className="ticker__set" aria-hidden={clone || undefined}>
            {ITEMS.map((item) => (
              <li key={item} className="ticker__item">
                {item}
                <span className="ticker__dot" aria-hidden="true">•</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
