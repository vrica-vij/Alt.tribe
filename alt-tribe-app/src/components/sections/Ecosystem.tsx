import type { CSSProperties } from 'react'

/* Clockwise from the top. The short names sit at the left and right,
   where a tag has the least room on a phone. `tilt` gives each tag a
   slightly different lean so the ring reads as scattered, not drawn. */
const CATEGORIES = [
  { name: 'Clothing', tilt: -4 },
  { name: 'Jewellery', tilt: 3 },
  { name: 'Bags', tilt: -2 },
  { name: 'Skincare', tilt: 4 },
  { name: 'Health & Wellness', tilt: -3 },
  { name: 'Edibles', tilt: 2 },
  { name: 'Lifestyle', tilt: -4 },
  { name: 'Home & Decor', tilt: 3 },
]

export function Ecosystem() {
  return (
    <section className="eco" id="ecosystem" aria-labelledby="eco-title">
      <div className="eco__inner">
        <div className="eco__head" data-reveal>
          <span className="eco__eyebrow">The Alt.Tribe Ecosystem</span>
          <h2 className="eco__title" id="eco-title">
            <span className="eco__count">100+</span> brands. <em>One curated space.</em>
          </h2>
          <p className="eco__lede">
            Our store brings together some of India&apos;s most exciting independent brands
            across:
          </p>
        </div>

        {/* The categories orbit the logo: each tag is placed on an ellipse
            by its angle, so the layout scales with the box at any width. */}
        <div className="eco__orbit">
          <div className="eco__core" data-reveal>
            <img src="/Alt Logo.avif" alt="Alt.Tribe" />
          </div>

          <ul className="eco__cats" data-reveal="stagger">
            {CATEGORIES.map((cat, i) => {
              const angle = ((i / CATEGORIES.length) * 360 - 90) * (Math.PI / 180)
              return (
                <li
                  key={cat.name}
                  className="eco__cat"
                  style={{
                    '--i': i,
                    '--cx': Math.cos(angle).toFixed(3),
                    '--cy': Math.sin(angle).toFixed(3),
                    '--tilt': `${cat.tilt}deg`,
                  } as CSSProperties}
                >
                  <span className="eco__tag">{cat.name}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="eco__note" data-reveal>
          Every brand is carefully selected, creating a constantly evolving retail experience
          where customers can discover something new every time they walk in.
        </p>
      </div>
    </section>
  )
}
