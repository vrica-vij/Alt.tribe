import type { CSSProperties } from 'react'

import { MobileMenu } from '@/components/ui/mobile-menu'

const NAV = [
  { name: 'Home', url: '#' },
  { name: 'About Us', url: '#about' },
  { name: 'Meet the Founder', url: '#founder' },
  { name: 'Our Ecosystem', url: '#ecosystem' },
  { name: 'Why Alt.Tribe', url: '#why' },
  { name: 'For Brands', url: '#for-brands' },
  { name: 'The Store', url: '#connect' },
  { name: 'Reviews', url: '#reviews' },
  {
    name: 'Collaborate with Us',
    children: [
      { name: 'Display your products', url: 'https://forms.gle/8iwsiXAjbwh27qg49' },
      { name: 'Host a workshop', url: 'https://forms.gle/jw35e8kQUmg2R9fV9' },
      { name: 'WhatsApp us', url: 'https://wa.me/919910012545' },
    ],
  },
]

const VISIT = {
  name: 'Visit the Store',
  url: 'https://maps.google.com/?q=Alt.Tribe,+M9+Market,+Block+M,+Greater+Kailash+II,+New+Delhi+110048',
}

const TITLE = ['Curated,', 'Different', 'And Eclectic']

export function Hero() {
  return (
    <section className="hero">
      <video
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/Favicon.webp"
      >
        <source
          src="/c0c2d9c97d154076aea285b73950d4d5.HD-1080p-7.2Mbps-50411234.mp4"
          type="video/mp4"
        />
      </video>
      <div className="hero__scrim" />

      {/* Logo left, menu button right, at every width. The header sits in
          the hero and scrolls away with it rather than staying pinned. */}
      <header className="nav">
        <a className="nav__logo" href="#" aria-label="Alt.Tribe home">
          <img src="/Alt Logo.avif" alt="Alt.Tribe" />
        </a>
        <MobileMenu items={NAV} cta={VISIT} />
      </header>

      <div className="hero__body">
        {/* Words are split so they can rise in one after another; the
            aria-label keeps it a single phrase for screen readers. */}
        <h1 className="hero__title" aria-label="Curated, Different And Eclectic">
          {TITLE.map((word, i) => (
            <span key={word} className="hero__word" style={{ '--i': i } as CSSProperties} aria-hidden="true">
              {word}
            </span>
          ))}
        </h1>
        {/* Each sentence holds to a single line; phones shrink the type to fit. */}
        <p className="hero__sub">
          <span className="hero__line">The people, brands, and ideas shaping what’s next.</span>
          <span className="hero__line">Alt.Tribe is where India’s boldest creators meet.</span>
        </p>
      </div>
    </section>
  )
}
