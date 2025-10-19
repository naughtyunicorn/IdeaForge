'use client'

import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Users, 
  Zap,
  Eye,
  Download,
  Share2
} from 'lucide-react'
import { motion } from 'framer-motion'

// Mock data - in real app, this would come from API
const mockData = {
  stats: {
    totalIdeas: 12,
    totalIPNFTs: 8,
    totalEarnings: '2.45',
    reputation: 85
  },
  ideas: [
    {
      id: 1,
      title: 'AI-Powered Code Review Tool',
      category: 'Technology',
      status: 'approved',
      aiScore: 92,
      submittedAt: '2024-01-15',
      tokenId: 123
    },
    {
      id: 2,
      title: 'Decentralized Music Streaming Protocol',
      category: 'Music',
      status: 'pending',
      aiScore: 0,
      submittedAt: '2024-01-20',
      tokenId: null
    },
    {
      id: 3,
      title: 'Sustainable Packaging Design',
      category: 'Art',
      status: 'minted',
      aiScore: 88,
      submittedAt: '2024-01-10',
      tokenId: 456
    }
  ],
  ipnfts: [
    {
      tokenId: 123,
      title: 'AI-Powered Code Review Tool',
      category: 'Technology',
      aiScore: 92,
      price: '0.5',
      views: 156,
      licenses: 3,
      earnings: '1.2'
    },
    {
      tokenId: 456,
      title: 'Sustainable Packaging Design',
      category: 'Art',
      aiScore: 88,
      price: '0.3',
      views: 89,
      licenses: 1,
      earnings: '0.3'
    }
  ],
  earnings: [
    {
      id: 1,
      source: 'AI-Powered Code Review Tool',
      amount: '0.5',
      type: 'license',
      date: '2024-01-18'
    },
    {
      id: 2,
      source: 'Sustainable Packaging Design',
      amount: '0.3',
      type: 'license',
      date: '2024-01-16'
    }
  ]
}

export default function DashboardPage() {
  const { isConnected, address } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to view your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's an overview of your ideas and earnings.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.stats.totalIdeas}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">IP-NFTs Minted</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.stats.totalIPNFTs}</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.stats.totalEarnings} ETH</div>
              <p className="text-xs text-muted-foreground">
                +0.3 ETH from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reputation</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.stats.reputation}</div>
              <p className="text-xs text-muted-foreground">
                +5 from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Tabs defaultValue="ideas" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ideas">My Ideas</TabsTrigger>
              <TabsTrigger value="ipnfts">IP-NFTs</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            {/* Ideas Tab */}
            <TabsContent value="ideas" className="space-y-4">
              <div className="grid gap-4">
                {mockData.ideas.map((idea) => (
                  <Card key={idea.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{idea.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {idea.category} • Submitted {idea.submittedAt}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={
                              idea.status === 'approved' ? 'default' :
                              idea.status === 'minted' ? 'secondary' : 'outline'
                            }
                          >
                            {idea.status}
                          </Badge>
                          {idea.aiScore > 0 && (
                            <Badge variant="outline">
                              AI Score: {idea.aiScore}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          {idea.tokenId && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download NFT
                            </Button>
                          )}
                        </div>
                        {idea.status === 'pending' && (
                          <div className="text-sm text-muted-foreground">
                            Awaiting validation...
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* IP-NFTs Tab */}
            <TabsContent value="ipnfts" className="space-y-4">
              <div className="grid gap-4">
                {mockData.ipnfts.map((nft) => (
                  <Card key={nft.tokenId}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{nft.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {nft.category} • Token ID: {nft.tokenId}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">
                          AI Score: {nft.aiScore}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{nft.price} ETH</div>
                          <div className="text-sm text-muted-foreground">Price</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{nft.views}</div>
                          <div className="text-sm text-muted-foreground">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{nft.licenses}</div>
                          <div className="text-sm text-muted-foreground">Licenses</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{nft.earnings} ETH</div>
                          <div className="text-sm text-muted-foreground">Earnings</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                        <Button size="sm" className="btn-forge">
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="space-y-4">
              <div className="grid gap-4">
                {mockData.earnings.map((earning) => (
                  <Card key={earning.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{earning.source}</CardTitle>
                          <CardDescription>
                            {earning.type} • {earning.date}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            +{earning.amount} ETH
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
