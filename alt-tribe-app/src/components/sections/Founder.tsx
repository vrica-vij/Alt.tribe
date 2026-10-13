/* Drop the founder's portrait into /public and set its path here, e.g.
   '/founder.webp'. Until then a placeholder frame holds the space. */
const FOUNDER_PHOTO: string | null = '/founder.jpeg'

export function Founder() {
  return (
    <section className="founder" id="founder">
      <div className="founder__inner">
        <div className="founder__head" data-reveal>
          <span className="founder__eyebrow">The person behind it</span>
          <h2 className="founder__title">Meet the Founder</h2>
        </div>

        <figure className="founder__photo" data-reveal>
          {FOUNDER_PHOTO ? (
            <img src={FOUNDER_PHOTO} alt="Vrica Vij, founder of Alt.Tribe" loading="lazy" />
          ) : (
            <div className="founder__placeholder" role="img" aria-label="Founder photo coming soon">
              <span className="founder__initials">VV</span>
              <span className="founder__placeholder-note">Photo coming soon</span>
            </div>
          )}
          <figcaption className="founder__caption">
            <span className="founder__name">Vrica Vij</span>
            <span className="founder__role">Founder, Alt.Tribe</span>
          </figcaption>
        </figure>

        <div className="founder__text" data-reveal>
          <p className="founder__body">
            Hi, I'm <span className="founder__highlight">Vrica Vij</span>, the person
            behind Alt.Tribe.
          </p>
          <p className="founder__body">
            I studied psychology, spent some time in the restaurant world, and eventually
            found myself in Australia on a trip, where I came across a concept that stayed
            with me: artists, independent creators and the local community all coming
            together under one roof to share what they made.
          </p>
          <blockquote className="founder__quote">
            I remember thinking, why don't we have more of this back home?
          </blockquote>
          <p className="founder__body">
            I wanted to create a space where independent brands could find an audience,
            people could discover things they wouldn't find everywhere else, and a
            community could form around the joy of finding something genuinely different.
          </p>
          <p className="founder__kicker">So… here we are.</p>
        </div>
      </div>
    </section>
  )
}
