import { useEffect, useState, type MouseEvent } from 'react'

const EMAIL = 'Partnerships@alt-tribe.in'
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`

/* Phones open their mail app from the mailto link. On computers a mailto
   link often does nothing (no mail app set up), so open a Gmail draft to
   the same address in a new tab instead. */
const openMail = (e: MouseEvent<HTMLAnchorElement>) => {
  if (window.matchMedia('(pointer: fine)').matches) {
    e.preventDefault()
    window.open(GMAIL_COMPOSE, '_blank', 'noopener')
  }
}

const Chevron = () => (
  <svg
    className="footer__chev"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export function Footer() {
  // Columns are accordions on phones and plain lists above that. Rendered
  // open so the links exist for crawlers, then collapsed on small screens.
  const [openOnLoad, setOpenOnLoad] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 620px)')
    const sync = () => setOpenOnLoad(!mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <footer className="footer">
      <div className="footer__inner" data-reveal>
        <div className="footer__brand">
          <a className="footer__brandmark" href="#">
            <img className="footer__logo" src="/Alt Logo.avif" alt="Alt.Tribe" />
          </a>

          <details className="footer__col footer__col--about" open={openOnLoad}>
            <summary className="footer__heading">
              About
              <Chevron />
            </summary>
            <p className="footer__desc">
              A curated home for India&apos;s homegrown brands, creators, designers and
              artists, handpicked from an industry we&apos;ve explored through 600+ brands.
              Every name we bring in is one we believe in and stand behind.
            </p>
            <ul className="footer__social">
              <li>
                <a href="https://www.instagram.com/alt.tribe.in/" target="_blank" rel="noopener" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <circle cx="17.5" cy="6.5" r="1" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=Alt.Tribe,+M9+Market,+Block+M,+Greater+Kailash+II,+New+Delhi+110048"
                  target="_blank"
                  rel="noopener"
                  aria-label="Find our store"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="tel:+919910012545" aria-label="Call +91 99100 12545">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} onClick={openMail} aria-label="Email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                </a>
              </li>
            </ul>
          </details>
        </div>

        <div className="footer__grid">
          <details className="footer__col" open={openOnLoad}>
            <summary className="footer__heading">
              Collaborate with Us
              <Chevron />
            </summary>
            <ul>
              <li>
                <a href="https://forms.gle/8iwsiXAjbwh27qg49" target="_blank" rel="noopener">
                  Display your products
                </a>
              </li>
              <li>
                <a href="https://forms.gle/jw35e8kQUmg2R9fV9" target="_blank" rel="noopener">
                  Host a workshop
                </a>
              </li>
              <li>
                <a href="https://wa.me/919910012545" target="_blank" rel="noopener">
                  WhatsApp us
                </a>
              </li>
            </ul>
          </details>

          <details className="footer__col" open={openOnLoad}>
            <summary className="footer__heading">
              Reach Us
              <Chevron />
            </summary>
            <ul>
              <li><a href={`mailto:${EMAIL}`} onClick={openMail}>{EMAIL}</a></li>
              <li><a href="tel:+919910012545">+91 99100 12545</a></li>
              <li><span className="footer__note">Monday – Sunday, 12:00 PM – 9:00 PM</span></li>
              <li>
                <span className="footer__note">
                  M9, Market, Block M,
                  <br />
                  Greater Kailash II, New Delhi 110048
                </span>
              </li>
            </ul>
          </details>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">
          © {new Date().getFullYear()} Alt.Tribe. All rights reserved.
        </p>
        <ul className="footer__legal">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms &amp; Conditions</a></li>
        </ul>
      </div>
    </footer>
  )
}
