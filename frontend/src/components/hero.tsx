'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 sm:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Transform Your Ideas Into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forge-400 to-nft-400">
                {' '}Tokenized IP
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
              The first platform to combine AI validation, DAO governance, and automated royalty distribution 
              for intellectual property. Turn your creative ideas into tradeable NFTs with guaranteed provenance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="btn-forge text-lg px-8 py-6">
              <Link href="/submit">
                Submit Your Idea
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-white/20 text-white hover:bg-white/10">
              <Link href="/market">
                Explore Market
              </Link>
            </Button>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forge-600/20 text-forge-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">AI Validation</h3>
              <p className="mt-2 text-sm text-slate-300">
                Advanced AI scoring ensures originality and quality
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dao-600/20 text-dao-400">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">DAO Governance</h3>
              <p className="mt-2 text-sm text-slate-300">
                Community-driven decisions with $FORGE token voting
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-nft-600/20 text-nft-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">Auto Royalties</h3>
              <p className="mt-2 text-sm text-slate-300">
                ERC-2981 standard ensures automatic royalty distribution
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="h-20 w-20 rounded-full bg-forge-500/20 blur-xl" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '2s' }}>
        <div className="h-32 w-32 rounded-full bg-nft-500/20 blur-xl" />
      </div>
    </section>
  )
}
