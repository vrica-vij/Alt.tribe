import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface NavLink {
  name: string
  url: string
}

/* An item with `children` is a toggle that reveals its sub-links. */
type NavItem = NavLink | { name: string; children: NavLink[] }

interface MobileMenuProps {
  items: NavItem[]
  /* The button pinned to the bottom of the drawer. */
  cta?: NavLink
}

const external = (url: string) =>
  url.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {}

/**
 * Site navigation: a round menu button that slides a brand-pink drawer in
 * from the right. The drawer is portalled to <body> so no section's
 * stacking order can sit on top of it.
 */
export function MobileMenu({ items, cta }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    // Stop the page scrolling behind the open drawer.
    document.documentElement.classList.add('menu-open')

    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('menu-open')
    }
  }, [open])

  const close = (returnFocus = true) => {
    setOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }

  return (
    <>
      <button
        type="button"
        className="mnav__toggle"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => {
          // Start each visit with the "Collaborate with Us" links folded away.
          setExpanded(null)
          setOpen(true)
        }}
        ref={buttonRef}
      >
        <span className="mnav__bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {createPortal(
        <div className={`mnav${open ? ' is-open' : ''}`} inert={!open}>
          <div className="mnav__backdrop" onClick={() => close()} />

          <nav
            id="mobile-menu"
            className="mnav__panel"
            aria-label="Main"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="mnav__close"
              aria-label="Close menu"
              onClick={() => close()}
              ref={closeRef}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <span className="mnav__eyebrow">Navigation</span>
            <ul className="mnav__list">
              {items.map((item) => {
                if (!('children' in item)) {
                  return (
                    <li key={item.name}>
                      <a className="mnav__link" href={item.url} onClick={() => close(false)} {...external(item.url)}>
                        {item.name}
                      </a>
                    </li>
                  )
                }
                const isOpen = expanded === item.name
                const subId = `mnav-sub-${item.name.toLowerCase().replace(/\W+/g, '-')}`
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      className="mnav__link mnav__toggle-sub"
                      aria-expanded={isOpen}
                      aria-controls={subId}
                      onClick={() => setExpanded(isOpen ? null : item.name)}
                    >
                      {item.name}
                      <svg className="mnav__chev" viewBox="0 0 24 24" aria-hidden="true">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <div className={`mnav__sub${isOpen ? ' is-open' : ''}`} id={subId}>
                      <ul inert={!isOpen}>
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <a className="mnav__sublink" href={child.url} onClick={() => close(false)} {...external(child.url)}>
                              {child.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                )
              })}
            </ul>

            {cta && (
              <a
                className="mnav__cta"
                href={cta.url}
                onClick={() => close(false)}
                {...external(cta.url)}
              >
                {cta.name}
              </a>
            )}
          </nav>
        </div>,
        document.body,
      )}
    </>
  )
}
