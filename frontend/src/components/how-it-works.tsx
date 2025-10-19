'use client'

import { motion } from 'framer-motion'
import { 
  Upload, 
  Brain, 
  Shield, 
  DollarSign,
  ArrowRight
} from 'lucide-react'

const steps = [
  {
    step: 1,
    icon: Upload,
    title: 'Submit Your Idea',
    description: 'Upload your creative idea with detailed description, category, and supporting files. All content is stored securely on IPFS.',
    color: 'text-forge-600',
    bgColor: 'bg-forge-100',
  },
  {
    step: 2,
    icon: Brain,
    title: 'AI Validation',
    description: 'Our advanced AI analyzes your submission for originality, quality, and market potential. Get an instant credibility score.',
    color: 'text-dao-600',
    bgColor: 'bg-dao-100',
  },
  {
    step: 3,
    icon: Shield,
    title: 'Mint IP-NFT',
    description: 'Once approved, your idea is automatically minted as an IP-NFT with embedded metadata and royalty settings.',
    color: 'text-nft-600',
    bgColor: 'bg-nft-100',
  },
  {
    step: 4,
    title: 'Monetize & Earn',
    description: 'Your IP-NFT is listed on our marketplace where others can license it. Earn automatic royalties from every transaction.',
    icon: DollarSign,
    color: 'text-forge-600',
    bgColor: 'bg-forge-100',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How IdeaForge Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            From idea submission to monetization in four simple steps. 
            Our platform handles all the technical complexity so you can focus on creativity.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-forge-200 via-dao-200 via-nft-200 to-forge-200 transform -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-center">
                  {/* Step number and icon */}
                  <div className="relative inline-flex items-center justify-center">
                    <div className={`h-16 w-16 rounded-full ${step.bgColor} flex items-center justify-center mb-6`}>
                      <step.icon className={`h-8 w-8 ${step.color}`} />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600">{step.step}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-8">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-2 text-forge-600 font-medium">
            <span>Ready to get started?</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
