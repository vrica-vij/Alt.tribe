/**
 * Scroll reveals for anything marked `data-reveal`. Each element gets
 * `is-in` the first time it enters the viewport; the motion itself lives
 * in site.css so it can be switched off under prefers-reduced-motion.
 *
 * Elements only start hidden once `reveal-ready` is on <html>, so if this
 * never runs (no JS, an error) the page is simply shown as-is.
 */
export function initReveal(): () => void {
  const root = document.documentElement
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]')

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'))
    return () => {}
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        io.unobserve(entry.target)
      }
    },
    // Fire as soon as any part is on screen. A ratio threshold is unsafe
    // here: on phones the reel and Instagram rows are several screens wide
    // (the looping marquee), so only a small fraction is ever visible and
    // the row could stay hidden for good.
    { rootMargin: '0px 0px -8% 0px', threshold: 0 },
  )

  targets.forEach((el) => io.observe(el))
  root.classList.add('reveal-ready')

  return () => io.disconnect()
}
