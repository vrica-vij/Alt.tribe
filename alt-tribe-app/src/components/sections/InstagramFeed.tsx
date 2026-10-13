import { useRef, type CSSProperties } from 'react'

import { LOOP_COPIES, useAutoScroll } from '@/lib/auto-scroll'

const POSTS = [
  { id: 'DblXErWhSfe', img: 'ig-1.jpg', tag: 'For Small Businesses', alt: 'Calling small businesses to stock with us' },
  { id: 'DbGS3sroJ6i', img: 'ig-2.jpg', tag: 'Founder Diaries', alt: 'A founder talks through the store' },
  { id: 'DanPesdhR3K', img: 'ig-3.jpg', tag: 'This or That', alt: 'Picking between rail finds in store' },
  { id: 'DafhmR3ByLG', img: 'ig-4.jpg', tag: 'Behind the Counter', alt: 'The team at the Alt.Tribe counter' },
  { id: 'DaXxpITBrww', img: 'ig-5.jpg', tag: 'Store Stories', alt: 'A story from inside the store' },
  { id: 'DZ43lyoBi0D', img: 'ig-6.jpg', tag: 'Team Skits', alt: 'POV: an age gap at work' },
]

export function InstagramFeed() {
  const gridRef = useRef<HTMLDivElement>(null)
  useAutoScroll(gridRef, 38)

  return (
    <section className="ig" id="connect">
      <div className="ig__head" data-reveal>
        <a
          className="ig__pill"
          href="https://www.instagram.com/alt.tribe.in/"
          target="_blank"
          rel="noopener"
        >
          Follow Us
        </a>
        <p className="ig__handle">@alt.tribe.in</p>
        <p className="ig__sub">
          Store tours, new arrivals, maker collabs and customer hauls — posted weekly.
        </p>
      </div>

      {/* Rendered three times: on phones the row drifts left on its own and
          can be swiped either way, and the copies either side are what make
          the loop seamless. It is hidden from screen readers and keyboard, and not
          shown on wider screens. */}
      <div className="ig__grid" data-reveal="stagger" ref={gridRef}>
        {LOOP_COPIES.flatMap((copy) => POSTS.map((p, i) => (
          <a
            key={`${copy}-${p.id}`}
            className={copy !== 'main' ? 'ig-tile ig-tile--clone' : 'ig-tile'}
            style={{ '--i': i } as CSSProperties}
            aria-hidden={copy !== 'main' || undefined}
            tabIndex={copy !== 'main' ? -1 : undefined}
            href={`https://www.instagram.com/reel/${p.id}/`}
            target="_blank"
            rel="noopener"
            aria-label={`${p.alt} — watch on Instagram`}
          >
            <img src={`/${p.img}`} alt={p.alt} width={360} height={640} />
            <span className="ig-tile__scrim" aria-hidden="true" />
            <span className="ig-tile__tag">{p.tag}</span>
          </a>
        )))}
      </div>

      <a
        className="ig__cta"
        data-reveal
        href="https://www.instagram.com/alt.tribe.in/"
        target="_blank"
        rel="noopener"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <circle cx="17.5" cy="6.5" r="1" />
        </svg>
        Check us out on Instagram
      </a>
    </section>
  )
}
