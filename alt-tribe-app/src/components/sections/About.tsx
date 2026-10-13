import { useEffect, useRef, useState } from 'react'

import ScrollableCardStack from '@/components/ui/scrollable-card-stack'

const PHOTOS = [
  { id: 'entrance', image: '/interior-1.webp', alt: 'The Alt.Tribe store floor, with the pink Alt.Tribe sign behind the counter' },
  { id: 'racks', image: '/interior-2.webp', alt: 'Clothing racks and home décor shelves under track lighting' },
  { id: 'edibles', image: '/interior-3.webp', alt: 'Skincare and edibles shelves beside a rail of knitwear' },
  { id: 'decor', image: '/interior-4.webp', alt: 'Hand-painted plates, lamps and baskets on wooden shelving' },
  { id: 'ethnic', image: '/interior-5.webp', alt: 'Rails of colourful kurtas and graphic tees' },
]

/* Card width as the stack lays it out: 92% of the slot, capped at 30rem
   (w-[92%] max-w-[30rem] in scrollable-card-stack). */
const CARD_WIDTH_RATIO = 0.92
const CARD_MAX_WIDTH = 480
/* The interior photos are 4:3 landscape (1360×1020). */
const PHOTO_ASPECT = 3 / 4
/* The card's 2px border on each side narrows the photo area; its height is
   set directly, so only the width loses the border. */
const CARD_BORDER = 4

/* Height the cards to the photos' exact 4:3 at whatever width the stack
   gets, so the whole photo shows on every screen instead of being cropped
   at the sides. */
function useCardHeight() {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(360)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const cardWidth = Math.min(entry.contentRect.width * CARD_WIDTH_RATIO, CARD_MAX_WIDTH)
      setHeight(Math.round((cardWidth - CARD_BORDER) * PHOTO_ASPECT))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, height }
}

export function About() {
  const { ref: stackRef, height: cardHeight } = useCardHeight()

  return (
    <section className="about" id="about">
      <div className="about__inner">
        {/* Heading, photos, text: the reading order on phones. On wider
            screens the grid lifts the photos into their own column. */}
        <div className="about__head" data-reveal>
          <span className="about__eyebrow">Greater Kailash II, Delhi</span>
          <h2 className="about__title">About Us</h2>
        </div>

        <div className="about__stack" data-reveal ref={stackRef}>
          <ScrollableCardStack
            autoplayInterval={2600}
            cardHeight={cardHeight}
            items={PHOTOS}
            perspective={1200}
            transitionDuration={200}
          />
        </div>

        <div className="about__text" data-reveal>
          <p className="about__body">
            A marketplace for the wonderfully different.
          </p>
          <p className="about__body">
            Alt.Tribe brings together{' '}
            <span className="about__count">100+ independent brands</span> across{' '}
            <span className="about__count about__count--wrap">
              fashion, jewellery, home décor, skincare, wellness, bags and edibles
            </span>.
          </p>
          <p className="about__body">
            One roof. A hundred perspectives. Everything from homegrown labels to
            hard-to-find discoveries. We give independent brands a physical retail space to
            grow, and shoppers a reason to look beyond the usual.
          </p>
          <p className="about__kicker">
            Basically, if you're tired of the same old, same old, you're probably going to
            like it here.
          </p>
        </div>
      </div>
    </section>
  )
}
