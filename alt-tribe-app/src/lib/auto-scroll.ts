import { useEffect, type RefObject } from 'react'

/** Matches the phone marquee rules in site.css. */
const QUERY = '(max-width: 560px) and (prefers-reduced-motion: no-preference)'
/** How long the row waits after the last swipe before drifting again. */
const RESUME_AFTER_MS = 2000
/** The row counts as settled once it has not moved on its own for this long. */
const SETTLE_MS = 180

/** The row holds the cards three times: a copy, the real set, a copy. */
export const LOOP_COPIES = ['before', 'main', 'after'] as const

/**
 * Phones: drifts a row of cards to the left on its own, while it stays a
 * real scroll container the viewer can swipe either way. The row holds the
 * cards three times and sits on the middle set; a full set on each side
 * means a swipe never runs into an edge.
 *
 * The jump back to the middle set only happens once the row has settled.
 * Writing scrollLeft during a swipe or its momentum makes iOS Safari stop
 * the scroll and paint the row blank for a moment.
 *
 * `loopSeconds` is the time one full set takes to pass.
 */
export function useAutoScroll(ref: RefObject<HTMLElement | null>, loopSeconds: number) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia(QUERY)

    let frame = 0
    let last = 0
    let pos = 0
    let touching = false
    let resumeAt = 0
    let movedAt = 0

    const setWidth = () => el.scrollWidth / LOOP_COPIES.length

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = last ? Math.min(now - last, 64) : 0
      last = now

      // The viewer moved it (swipe, momentum, trackpad): follow along and
      // hold off, so their scroll is never fought or cut short.
      if (Math.abs(el.scrollLeft - pos) > 2) {
        pos = el.scrollLeft
        movedAt = now
        resumeAt = Math.max(resumeAt, now + RESUME_AFTER_MS)
      }

      const w = setWidth()
      if (w <= 0) return

      // Hands off until the swipe and its momentum have fully stopped.
      if (touching || now - movedAt < SETTLE_MS) return

      let next = pos
      if (now >= resumeAt) next += (w / loopSeconds) * (dt / 1000)

      // Keep the view on the middle set. The copies look identical, so
      // the jump is invisible.
      if (next >= 2 * w) next -= w
      else if (next < w) next += w

      if (next !== pos) {
        el.scrollLeft = next
        // Keep the fractional position; the element may round it.
        pos = next
      }
    }

    const onTouchStart = () => {
      touching = true
    }
    const onTouchEnd = () => {
      touching = false
      resumeAt = performance.now() + RESUME_AFTER_MS
    }

    const start = () => {
      stop()
      // Start on the first card of the middle set.
      el.scrollLeft = setWidth()
      pos = el.scrollLeft
      last = 0
      movedAt = 0
      frame = requestAnimationFrame(tick)
      el.addEventListener('touchstart', onTouchStart, { passive: true })
      el.addEventListener('touchend', onTouchEnd, { passive: true })
      el.addEventListener('touchcancel', onTouchEnd, { passive: true })
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
    const sync = () => (mq.matches ? start() : (stop(), (el.scrollLeft = 0)))

    sync()
    mq.addEventListener('change', sync)
    return () => {
      stop()
      mq.removeEventListener('change', sync)
    }
  }, [ref, loopSeconds])
}
