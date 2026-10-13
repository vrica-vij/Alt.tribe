import { useEffect } from 'react'

import { About } from '@/components/sections/About'
import { Ecosystem } from '@/components/sections/Ecosystem'
import { Footer } from '@/components/sections/Footer'
import { ForBrands } from '@/components/sections/ForBrands'
import { Founder } from '@/components/sections/Founder'
import { Hero } from '@/components/sections/Hero'
import { InstagramFeed } from '@/components/sections/InstagramFeed'
import { Testimonials } from '@/components/sections/Testimonials'
import { Ticker } from '@/components/sections/Ticker'
import { WhyAltTribe } from '@/components/sections/WhyAltTribe'
import { JoinButton } from '@/components/ui/join-button'
import { initReveal } from '@/lib/reveal'

export default function App() {
  useEffect(() => initReveal(), [])

  return (
    <>
      <Hero />
      <Ticker />
      <About />
      <Founder />
      <Ecosystem />
      <WhyAltTribe />
      <ForBrands />
      <InstagramFeed />
      <Testimonials />
      <Footer />
      <JoinButton />
    </>
  )
}
