'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-forge-600 to-nft-600">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 text-forge-100 mb-4">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Ready to revolutionize your ideas?</span>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
            Start Your IP-NFT Journey Today
          </h2>
          
          <p className="text-xl text-forge-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already monetizing their intellectual property 
            with blockchain technology and AI validation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-forge-600 hover:bg-forge-50 text-lg px-8 py-6">
              <Link href="/submit">
                Submit Your First Idea
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6">
              <Link href="/whitepaper">
                Read Whitepaper
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-white mb-2">100%</div>
              <div className="text-forge-100">Decentralized</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-2">24/7</div>
              <div className="text-forge-100">AI Validation</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-2">∞</div>
              <div className="text-forge-100">Possibilities</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
