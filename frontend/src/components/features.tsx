'use client'

import { motion } from 'framer-motion'
import { 
  Brain, 
  Shield, 
  DollarSign, 
  Users, 
  FileText, 
  Zap,
  Lock,
  TrendingUp,
  Globe
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Validation',
    description: 'Advanced OpenAI integration validates originality and assigns credibility scores to every submission.',
    color: 'text-forge-600',
    bgColor: 'bg-forge-50',
  },
  {
    icon: Shield,
    title: 'Blockchain Security',
    description: 'Immutable IPFS storage with on-chain proof of ownership and timestamp verification.',
    color: 'text-dao-600',
    bgColor: 'bg-dao-50',
  },
  {
    icon: DollarSign,
    title: 'Automated Royalties',
    description: 'ERC-2981 standard ensures automatic royalty distribution to creators and collaborators.',
    color: 'text-nft-600',
    bgColor: 'bg-nft-50',
  },
  {
    icon: Users,
    title: 'DAO Governance',
    description: 'Community-driven platform decisions with $FORGE token voting and proposal system.',
    color: 'text-dao-600',
    bgColor: 'bg-dao-50',
  },
  {
    icon: FileText,
    title: 'Legal Framework',
    description: 'On-chain legal agreements and licensing rights with verifiable metadata.',
    color: 'text-forge-600',
    bgColor: 'bg-forge-50',
  },
  {
    icon: Zap,
    title: 'Instant Monetization',
    description: 'Convert ideas to tradeable IP-NFTs with immediate marketplace access.',
    color: 'text-nft-600',
    bgColor: 'bg-nft-50',
  },
  {
    icon: Lock,
    title: 'Provenance Tracking',
    description: 'Complete ownership history and transfer records on the blockchain.',
    color: 'text-forge-600',
    bgColor: 'bg-forge-50',
  },
  {
    icon: TrendingUp,
    title: 'Market Analytics',
    description: 'Real-time pricing, demand analysis, and performance metrics for your IP.',
    color: 'text-dao-600',
    bgColor: 'bg-dao-50',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Decentralized platform accessible worldwide with multi-chain support.',
    color: 'text-nft-600',
    bgColor: 'bg-nft-50',
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need to Monetize Your Ideas
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            IdeaForge combines cutting-edge technology with user-friendly tools to create 
            the most comprehensive IP monetization platform in the Web3 space.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor} mb-6`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-forge-500/5 to-nft-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
