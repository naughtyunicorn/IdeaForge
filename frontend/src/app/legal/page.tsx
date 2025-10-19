'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Shield, 
  Users, 
  Scale,
  Download,
  Eye,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

const legalDocuments = [
  {
    id: 'terms-of-service',
    title: 'Terms of Service',
    description: 'Platform usage terms and conditions',
    type: 'Platform',
    status: 'Active',
    version: '1.0',
    lastUpdated: '2024-01-15',
    size: '2.3 MB',
    pages: 12
  },
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    description: 'Data collection and privacy practices',
    type: 'Platform',
    status: 'Active',
    version: '1.0',
    lastUpdated: '2024-01-15',
    size: '1.8 MB',
    pages: 8
  },
  {
    id: 'dao-charter',
    title: 'DAO Charter',
    description: 'Governance framework and voting procedures',
    type: 'Governance',
    status: 'Active',
    version: '1.0',
    lastUpdated: '2024-01-10',
    size: '3.1 MB',
    pages: 15
  },
  {
    id: 'ip-licensing-agreement',
    title: 'IP Licensing Agreement',
    description: 'Standard terms for IP-NFT licensing',
    type: 'Legal',
    status: 'Active',
    version: '1.0',
    lastUpdated: '2024-01-12',
    size: '2.7 MB',
    pages: 10
  },
  {
    id: 'founders-agreement',
    title: 'Founders Agreement',
    description: 'Team and equity distribution terms',
    type: 'Internal',
    status: 'Confidential',
    version: '1.0',
    lastUpdated: '2024-01-01',
    size: '1.5 MB',
    pages: 6
  },
  {
    id: 'token-economics',
    title: 'Token Economics',
    description: '$FORGE token distribution and utility',
    type: 'Economic',
    status: 'Active',
    version: '1.0',
    lastUpdated: '2024-01-08',
    size: '2.1 MB',
    pages: 9
  }
]

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Platform':
      return 'bg-blue-100 text-blue-800'
    case 'Governance':
      return 'bg-green-100 text-green-800'
    case 'Legal':
      return 'bg-purple-100 text-purple-800'
    case 'Internal':
      return 'bg-gray-100 text-gray-800'
    case 'Economic':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800'
    case 'Confidential':
      return 'bg-red-100 text-red-800'
    case 'Draft':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Legal Documents
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparent legal framework and governance documents for the IdeaForge platform
          </p>
        </motion.div>

        {/* Key Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-forge-600 mx-auto mb-4" />
              <CardTitle>Legal Compliance</CardTitle>
              <CardDescription>
                All documents reviewed by legal experts and updated regularly
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-dao-600 mx-auto mb-4" />
              <CardTitle>Community Governed</CardTitle>
              <CardDescription>
                Legal framework evolves through DAO governance and community input
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Scale className="h-12 w-12 text-nft-600 mx-auto mb-4" />
              <CardTitle>Transparent Process</CardTitle>
              <CardDescription>
                All legal changes are publicly documented and community-accessible
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Documents List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Documents</h2>
          
          <div className="grid gap-6">
            {legalDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-forge-100">
                          <FileText className="h-6 w-6 text-forge-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{doc.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {doc.description}
                          </CardDescription>
                          <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                            <span>Version {doc.version}</span>
                            <span>•</span>
                            <span>Updated {doc.lastUpdated}</span>
                            <span>•</span>
                            <span>{doc.pages} pages</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTypeColor(doc.type)}>
                          {doc.type}
                        </Badge>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Legal Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12"
        >
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Legal Notice
                  </h3>
                  <p className="text-yellow-800 text-sm leading-relaxed">
                    These documents are provided for informational purposes only and do not constitute legal advice. 
                    Please consult with a qualified legal professional for specific legal questions. 
                    The IdeaForge platform operates in compliance with applicable laws and regulations, 
                    and users are responsible for ensuring their compliance with local laws.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-8 text-center"
        >
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Questions About Our Legal Framework?
              </h3>
              <p className="text-gray-600 mb-6">
                Our legal team is available to answer questions about our platform's legal structure and compliance.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button className="btn-forge">
                  Contact Legal Team
                </Button>
                <Button variant="outline">
                  Join Community Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
