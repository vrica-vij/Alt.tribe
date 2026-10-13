/* Same form as "Display your products" in the footer. */
const APPLY_URL = 'https://forms.gle/8iwsiXAjbwh27qg49'

export function ForBrands() {
  return (
    <section className="brands" id="for-brands" aria-labelledby="brands-title">
      <div className="brands__inner">
        <div className="brands__copy" data-reveal>
          <span className="brands__eyebrow">For Brands</span>
          <h2 className="brands__title" id="brands-title">
            Your brand. Our space. <em>One less thing to worry about.</em>
          </h2>
          <p className="brands__body">
            At Alt.Tribe, you get the opportunity to take your brand offline, test physical
            retail and connect directly with customers, without having to build an entire
            retail operation from scratch.
          </p>
          <p className="brands__split">
            <span>You focus on your products and your brand.</span>
            <span>We handle the rest.</span>
          </p>
        </div>

        <div className="brands__cta" data-reveal>
          <p className="brands__cta-title">Think your brand belongs here?</p>
          <a className="brands__btn" href={APPLY_URL} target="_blank" rel="noopener">
            Display at Alt.Tribe <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
