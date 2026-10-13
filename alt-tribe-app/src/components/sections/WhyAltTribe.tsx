import type { CSSProperties, ReactNode } from 'react'

const icon = (children: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

const BENEFITS = [
  {
    title: 'Affordable Retail Space',
    body: 'Get your products in front of real customers without taking on the cost of setting up and running your own store.',
    icon: icon(
      <>
        <path d="M3 9l1.5-5h15L21 9" />
        <path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z" />
        <path d="M5 13v7h14v-7" />
        <path d="M10 20v-4h4v4" />
      </>,
    ),
  },
  {
    title: 'Seamless Operations',
    body: 'From day-to-day store management to product movement and retail operations, we take care of the physical side.',
    icon: icon(
      <>
        <path d="M21 8l-9-5-9 5 9 5 9-5z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </>,
    ),
  },
  {
    title: 'Customer Feedback',
    body: 'Meet customers offline, understand what they respond to and build a real-world presence for your brand.',
    icon: icon(
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 20a6 6 0 0 1 12 0" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M15.5 14.2A5 5 0 0 1 21 19" />
      </>,
    ),
  },
  {
    title: 'A Community of Brands',
    body: 'Be part of an ecosystem of 100+ independent brands, creators and businesses, all under one roof.',
    icon: icon(
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>,
    ),
  },
]

export function WhyAltTribe() {
  return (
    <section className="why" id="why" aria-labelledby="why-title">
      <div className="why__inner">
        <div className="why__head" data-reveal>
          <span className="why__eyebrow">Why Alt.Tribe?</span>
          <h2 className="why__title" id="why-title">
            You build the brand. <em>We handle the retail.</em>
          </h2>
          <p className="why__lede">
            Alt.Tribe gives independent brands a physical retail presence without the
            traditional cost and operational burden of running a store.
          </p>
        </div>

        <ul className="why__grid" data-reveal="stagger">
          {BENEFITS.map((b, i) => (
            <li key={b.title} className="why__card" style={{ '--i': i } as CSSProperties}>
              <span className="why__icon">{b.icon}</span>
              <h3 className="why__card-title">{b.title}</h3>
              <p className="why__card-body">{b.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
