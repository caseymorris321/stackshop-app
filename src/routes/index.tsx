import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { CalculatorsSection } from '@/components/sections/CalculatorsSection'
import { SubscribeSection } from '@/components/sections/SubscribeSection'
import { Footer } from '@/components/layout/Footer'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CalculatorsSection />
      <SubscribeSection />
      <Footer />
    </>
  )
}
