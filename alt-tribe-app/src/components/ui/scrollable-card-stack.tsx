'use client'

import { cn } from '@/lib/utils'
import { motion, useMotionValue, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

const SCROLL_TIMEOUT_OFFSET = 100
const MIN_SCROLL_INTERVAL = 300
const TOUCH_SWIPE_THRESHOLD = 40
const SCALE_FACTOR = 0.08
const MIN_SCALE = 0.08
const MAX_SCALE = 2
const HOVER_SCALE_MULTIPLIER = 1.02
const CARD_PADDING = 64

const FRAME_OFFSET = -30
const FRAMES_VISIBLE_LENGTH = 3
const SNAP_DISTANCE = 50

interface CardItem {
  alt: string
  id: string
  image: string
}

export interface ScrollableCardStackProps {
  /** Milliseconds between automatic advances. 0 disables autoplay. */
  autoplayInterval?: number
  cardHeight?: number
  className?: string
  items: CardItem[]
  perspective?: number
  transitionDuration?: number
}

const ScrollableCardStack: React.FC<ScrollableCardStackProps> = ({
  items,
  autoplayInterval = 0,
  cardHeight = 384,
  perspective = 1000,
  transitionDuration = 180,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollY = useMotionValue(0)
  const lastScrollTime = useRef(0)
  const shouldReduceMotion = useReducedMotion()

  const maxIndex = items.length - 1

  /* How far the back cards rise above the front card's padded slot. They
     sit FRAME_OFFSET higher per step but also shrink, so the rise is the
     offset less half the height they lose; a few px more covers the blur.
     Reserved above the stack so they never ride up over the content before
     it (with motion reduced the cards do not fan out, so nothing to add). */
  const backRise = FRAMES_VISIBLE_LENGTH * -FRAME_OFFSET
    - (FRAMES_VISIBLE_LENGTH * SCALE_FACTOR * cardHeight) / 2
  const peek = shouldReduceMotion
    ? 0
    : Math.max(0, Math.ceil(backRise - CARD_PADDING / 2 + 4))

  const clamp = useCallback(
    (val: number, [min, max]: [number, number]): number =>
      Math.min(Math.max(val, min), max),
    [],
  )

  const scrollToCard = useCallback(
    (direction: 1 | -1) => {
      if (isScrolling) {
        return
      }

      const now = Date.now()
      if (now - lastScrollTime.current < MIN_SCROLL_INTERVAL) {
        return
      }

      const newIndex = clamp(currentIndex + direction, [0, maxIndex])

      if (newIndex !== currentIndex) {
        lastScrollTime.current = now
        setIsScrolling(true)
        setCurrentIndex(newIndex)
        scrollY.set(newIndex * SNAP_DISTANCE)

        setTimeout(() => {
          setIsScrolling(false)
        }, transitionDuration + SCROLL_TIMEOUT_OFFSET)
      }
    },
    [currentIndex, maxIndex, scrollY, isScrolling, transitionDuration, clamp],
  )

  const goToIndex = useCallback(
    (i: number) => {
      if (i === currentIndex || isScrolling) {
        return
      }
      setIsScrolling(true)
      setCurrentIndex(i)
      scrollY.set(i * SNAP_DISTANCE)
      setTimeout(() => {
        setIsScrolling(false)
      }, transitionDuration + SCROLL_TIMEOUT_OFFSET)
    },
    [currentIndex, isScrolling, scrollY, transitionDuration],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isScrolling) {
        return
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft': {
          e.preventDefault()
          scrollToCard(-1)
          break
        }
        case 'ArrowDown':
        case 'ArrowRight': {
          e.preventDefault()
          scrollToCard(1)
          break
        }
        case 'Home': {
          e.preventDefault()
          goToIndex(0)
          break
        }
        case 'End': {
          e.preventDefault()
          goToIndex(maxIndex)
          break
        }
        default: {
          break
        }
      }
    },
    [maxIndex, isScrolling, scrollToCard, goToIndex],
  )

  const touchStart = useRef({ x: 0, y: 0 })
  const touchMoved = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    touchMoved.current = false
    setIsDragging(true)
  }, [])

  /* Swipe sideways to change photo: left for the next, right for the
     previous, wrapping at the ends like autoplay does. Vertical drags are
     left alone so the page still scrolls past the stack. One photo per
     swipe. */
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || isScrolling || touchMoved.current) {
        return
      }

      const deltaX = touchStart.current.x - e.touches[0].clientX
      const deltaY = touchStart.current.y - e.touches[0].clientY

      if (
        Math.abs(deltaX) > TOUCH_SWIPE_THRESHOLD &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        const count = items.length
        goToIndex((currentIndex + (deltaX > 0 ? 1 : -1) + count) % count)
        touchMoved.current = true
      }
    },
    [isDragging, isScrolling, goToIndex, currentIndex, items.length],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    touchMoved.current = false
  }, [])

  // Snap to the current index once a drag settles.
  useEffect(() => {
    if (!isDragging) {
      scrollY.set(currentIndex * SNAP_DISTANCE)
    }
  }, [currentIndex, isDragging, scrollY])

  /* Autoplay. Wraps past the last card back to the first, which
     scrollToCard cannot do because it clamps at the ends. Pauses while
     the viewer is interacting, and stays off entirely for viewers who
     asked for reduced motion. */
  const isPaused = hoveredIndex !== null || isDragging
  useEffect(() => {
    if (!autoplayInterval || shouldReduceMotion || isPaused || isScrolling) {
      return
    }

    /* Keyed on currentIndex so a manual jump restarts the countdown —
       otherwise a click landing late in the interval would be replaced
       almost immediately by the next auto-advance. */
    const id = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, autoplayInterval)

    return () => clearTimeout(id)
  }, [
    autoplayInterval,
    shouldReduceMotion,
    isPaused,
    isScrolling,
    currentIndex,
    items.length,
  ])

  /* Depth is measured cyclically: a card already passed re-enters at the
     back of the stack rather than vanishing. Without this the stack would
     thin from full to a single card across one autoplay cycle, then pop
     back — obvious on a short loop. */
  const getCardTransform = useCallback(
    (index: number) => {
      const count = items.length
      const offsetIndex = (index - currentIndex + count) % count
      const isVisible = offsetIndex <= FRAMES_VISIBLE_LENGTH

      return {
        blur: !shouldReduceMotion && offsetIndex > 0 ? Math.min(offsetIndex, 2) : 0,
        opacity: isVisible ? 1 : 0,
        scale: shouldReduceMotion
          ? 1
          : clamp(1 - offsetIndex * SCALE_FACTOR, [MIN_SCALE, MAX_SCALE]),
        y: shouldReduceMotion
          ? 0
          : clamp(offsetIndex * FRAME_OFFSET, [
              FRAME_OFFSET * FRAMES_VISIBLE_LENGTH,
              Number.POSITIVE_INFINITY,
            ]),
        zIndex: count - offsetIndex,
      }
    },
    [currentIndex, items.length, clamp, shouldReduceMotion],
  )

  return (
    <section
      aria-atomic="true"
      aria-label="Store photos"
      aria-live="polite"
      className={cn('relative mx-auto h-fit w-full', className)}
    >
      <div
        aria-label="Store photo stack"
        className="h-full w-full outline-none"
        onKeyDown={handleKeyDown}
        onTouchCancel={handleTouchEnd}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        ref={containerRef}
        role="application"
        style={{
          minHeight: `${cardHeight + CARD_PADDING + peek}px`,
          perspective: `${perspective}px`,
          perspectiveOrigin: 'center 60%',
          // Horizontal drags are ours; vertical ones scroll the page.
          touchAction: 'pan-y',
        }}
        tabIndex={0}
      >
        {items.map((item, i) => {
          const transform = getCardTransform(i)
          const isActive = i === currentIndex
          const isHovered = hoveredIndex === i

          return (
            <motion.div
              animate={
                /* Centring needs both axes even with motion reduced; x alone
                   left every card hanging half its height below the slot. */
                shouldReduceMotion
                  ? { x: '-50%', y: '-50%' }
                  : {
                      scale: transform.scale,
                      x: '-50%',
                      y: `calc(-50% + ${transform.y}px)`,
                    }
              }
              aria-hidden={!isActive}
              className="absolute left-1/2 w-[92%] max-w-[30rem] overflow-hidden rounded-[18px] border-[rgba(36,29,26,.12)] bg-[#efe6d8] shadow-lg"
              data-active={isActive}
              initial={false}
              key={`stack-card-${item.id}`}
              onBlur={() => setHoveredIndex(null)}
              onFocus={() => isActive && setHoveredIndex(i)}
              onMouseEnter={() => isActive && setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                // Centre in the slot below the reserved peek space.
                top: `calc(50% + ${peek / 2}px)`,
                borderWidth: `${2 / transform.scale}px`,
                filter: `blur(${transform.blur}px)`,
                height: `${cardHeight}px`,
                opacity: transform.opacity,
                pointerEvents: isActive ? 'auto' : 'none',
                transformOrigin: 'center center',
                transitionDuration: shouldReduceMotion ? '0ms' : '200ms',
                transitionProperty: shouldReduceMotion
                  ? 'none'
                  : 'opacity, filter',
                transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
                willChange: shouldReduceMotion
                  ? undefined
                  : 'opacity, filter, transform',
                zIndex: transform.zIndex,
              }}
              tabIndex={isActive ? 0 : -1}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      damping: 20,
                      duration: 0.25,
                      mass: 0.5,
                      stiffness: 250,
                      type: 'spring' as const,
                    }
              }
              whileHover={
                shouldReduceMotion || !isActive
                  ? {}
                  : {
                      scale: transform.scale * HOVER_SCALE_MULTIPLIER,
                      transition: {
                        damping: 20,
                        duration: 0.25,
                        mass: 0.5,
                        stiffness: 250,
                        type: 'spring' as const,
                      },
                    }
              }
            >
              <div
                className={cn(
                  'flex w-full flex-col overflow-hidden rounded-[18px] bg-[#efe6d8] transition-all duration-200',
                  isHovered && 'shadow-xl',
                )}
                style={{ height: `${cardHeight}px` }}
              >
                <div className="relative w-full flex-1 overflow-hidden">
                  <img
                    alt={item.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    decoding="async"
                    draggable={false}
                    height={cardHeight}
                    loading="lazy"
                    src={item.image}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                    width={400}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}

        <div
          aria-label="Photo navigation"
          className="absolute bottom-0 left-1/2 flex -translate-x-1/2 transform space-x-2"
          role="tablist"
        >
          {Array.from({ length: items.length }, (_, i) => (
            <motion.button
              aria-label={`Go to photo ${i + 1} of ${items.length}`}
              aria-selected={i === currentIndex}
              className={cn(
                'h-2 w-2 cursor-pointer rounded-full transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-brand-pink focus:ring-offset-1',
                i === currentIndex
                  ? 'scale-125 bg-brand-pink'
                  : 'bg-[rgba(36,29,26,.22)] hover:bg-[rgba(36,29,26,.42)]',
              )}
              key={`stack-dot-${items[i]?.id || i}`}
              onClick={() => goToIndex(i)}
              role="tab"
              transition={{
                damping: 20,
                mass: 0.5,
                stiffness: 250,
                type: 'spring' as const,
              }}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <div aria-live="polite" className="sr-only">
          {`Photo ${currentIndex + 1} of ${items.length} selected. Swipe, use arrow keys, or click the dots below to navigate.`}
        </div>
      </div>
    </section>
  )
}

export default ScrollableCardStack
