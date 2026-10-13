import { useRef, type CSSProperties } from 'react'

import { LOOP_COPIES, useAutoScroll } from '@/lib/auto-scroll'

const REELS = [
  { id: 'DYkEfgtB3Vl', img: 'testimonial-1.jpg', alt: 'A shopper on her Alt.Tribe visit' },
  { id: 'DOpqMkBAX94', img: 'testimonial-2.jpg', alt: 'Customer experience in store' },
  { id: 'DM5ZancMPdl', img: 'testimonial-3.jpg', alt: 'A shopper shares what she found' },
  { id: 'DJO8yM8SHti', img: 'testimonial-4.jpg', alt: 'Inside the Alt.Tribe store' },
  { id: 'DI1YByry977', img: 'testimonial-5.jpg', alt: 'A shopper shares her haul' },
  { id: 'DGfp6I4ziQN', img: 'testimonial-6.jpg', alt: 'A shopper reviews her Alt.Tribe visit' },
]

export function Testimonials() {
  const railRef = useRef<HTMLDivElement>(null)
  useAutoScroll(railRef, 34)

  return (
    <section className="tstm" id="reviews">
      <div className="tstm__head" data-reveal>
        <h2 className="tstm__title">In Their Words</h2>
        <p className="tstm__sub">
          Happy customers, in their own words. Tap any clip to watch it on Instagram.
        </p>
      </div>

      <div className="tstm__rail-wrap">
        {/* Rendered three times: on phones the row drifts left on its own and
            can be swiped either way, and the copies either side are what make
            the loop seamless. It is hidden from screen readers and keyboard, and not
            shown on wider screens. */}
        <div className="tstm__rail" data-reveal="stagger" ref={railRef}>
          {LOOP_COPIES.flatMap((copy) => REELS.map((r, i) => (
            <a
              key={`${copy}-${r.id}`}
              className={copy !== 'main' ? 'reel reel--clone' : 'reel'}
              style={{ '--i': i } as CSSProperties}
              aria-hidden={copy !== 'main' || undefined}
              tabIndex={copy !== 'main' ? -1 : undefined}
              href={`https://www.instagram.com/reel/${r.id}/`}
              target="_blank"
              rel="noopener"
              aria-label={`Watch on Instagram: ${r.alt}`}
            >
              <img src={`/${r.img}`} alt={r.alt} width={360} height={640} />
              <span className="reel__play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                  <path d="M9.5 6.4v11.2L18.5 12z" />
                </svg>
              </span>
              <span className="reel__badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </span>
            </a>
          )))}
        </div>
      </div>

      <a
        className="tstm__cta"
        data-reveal
        href="https://www.instagram.com/alt.tribe.in/"
        target="_blank"
        rel="noopener"
      >
        Check out our Instagram
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        </svg>
      </a>
    </section>
  )
}
