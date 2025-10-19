import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { HowItWorks } from '@/components/how-it-works'
import { Tokenomics } from '@/components/tokenomics'
import { Stats } from '@/components/stats'
import { CTA } from '@/components/cta'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Tokenomics />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
