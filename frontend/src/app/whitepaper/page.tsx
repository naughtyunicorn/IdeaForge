'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Share2, 
  FileText, 
  Zap, 
  Users, 
  DollarSign,
  Shield,
  Brain,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

const sections = [
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    icon: FileText,
    content: 'IdeaForge is a revolutionary platform that transforms intellectual property into tradeable NFTs with AI validation, DAO governance, and automated royalty distribution. Our platform enables creators to monetize their ideas while ensuring fair compensation and transparent ownership.'
  },
  {
    id: 'problem-statement',
    title: 'Problem Statement',
    icon: Zap,
    content: 'Traditional IP protection is expensive, slow, and inaccessible to many creators. Current systems lack transparency, have high barriers to entry, and don\'t provide fair compensation mechanisms. The creative economy needs a decentralized solution that puts creators first.'
  },
  {
    id: 'solution',
    title: 'Our Solution',
    icon: Brain,
    content: 'IdeaForge combines blockchain technology, AI validation, and DAO governance to create a comprehensive IP monetization platform. We provide instant validation, transparent ownership records, and automated royalty distribution through smart contracts.'
  },
  {
    id: 'technology',
    title: 'Technology Stack',
    icon: Shield,
    content: 'Built on Polygon blockchain with IPFS storage, OpenAI validation, and ERC-2981 royalty standards. Our smart contracts ensure immutable ownership records and automatic royalty distribution to creators and collaborators.'
  },
  {
    id: 'tokenomics',
    title: 'Tokenomics',
    icon: DollarSign,
    content: '$FORGE token serves as both utility and governance token. 40% allocated to community rewards, 25% to DAO treasury, 15% to team, 10% to liquidity, and 10% to marketing. Revenue is split 70% to creators, 15% to DAO, 10% to platform, and 5% to validators.'
  },
  {
    id: 'governance',
    title: 'DAO Governance',
    icon: Users,
    content: 'Community-driven decision making through $FORGE token voting. Proposals cover platform parameters, treasury management, and feature development. Transparent voting process with 4% quorum requirement and 2-day voting period.'
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    icon: Globe,
    content: 'Q1 2024: MVP launch on Polygon Mumbai. Q2 2024: Mainnet deployment and mobile app. Q3 2024: Multi-chain support and advanced AI features. Q4 2024: Enterprise partnerships and global expansion.'
  }
]

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            IdeaForge Whitepaper
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            The complete technical and economic specification for the IdeaForge platform
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button className="btn-forge">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forge-100">
                      <section.icon className="h-5 w-5 text-forge-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <CardDescription>
                        Section {index + 1} of {sections.length}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Technical Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
              <CardDescription>
                Detailed technical implementation and smart contract specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Smart Contracts</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• ForgeToken.sol - ERC-20 utility token</li>
                    <li>• IPNFT.sol - ERC-721A with ERC-2981 royalties</li>
                    <li>• IdeaForgeCore.sol - Main platform logic</li>
                    <li>• IdeaForgeDAO.sol - Governance system</li>
                    <li>• RevenueSplitter.sol - Royalty distribution</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Network Details</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Blockchain: Polygon (Mumbai → Mainnet)</li>
                    <li>• Storage: IPFS with Pinata pinning</li>
                    <li>• AI: OpenAI GPT-4 integration</li>
                    <li>• Payments: Stripe + On-chain</li>
                    <li>• Governance: OpenZeppelin Governor</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-forge-600 to-nft-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Join the Future of IP Monetization?
              </h3>
              <p className="text-forge-100 mb-6">
                Start creating, validating, and monetizing your ideas today.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button className="bg-white text-forge-600 hover:bg-forge-50">
                  Get Started
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  View Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
