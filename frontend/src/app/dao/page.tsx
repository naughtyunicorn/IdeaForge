'use client'

import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Vote, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import { motion } from 'framer-motion'

// Mock data - in real app, this would come from API
const mockData = {
  stats: {
    totalProposals: 24,
    activeProposals: 3,
    totalVotes: 156,
    treasuryBalance: '125.5'
  },
  proposals: [
    {
      id: 1,
      title: 'Increase Platform Fee to 3%',
      description: 'Proposal to increase the platform fee from 2.5% to 3% to fund additional development and marketing efforts.',
      proposer: '0x1234...5678',
      type: 'PLATFORM',
      status: 'active',
      forVotes: '45.2',
      againstVotes: '12.8',
      abstainVotes: '3.1',
      quorum: '50.0',
      votingEnd: '2024-02-15',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Add New Category: Gaming',
      description: 'Add a new category for gaming-related ideas and IP-NFTs to better organize submissions.',
      proposer: '0x8765...4321',
      type: 'PLATFORM',
      status: 'succeeded',
      forVotes: '78.5',
      againstVotes: '15.2',
      abstainVotes: '6.3',
      quorum: '50.0',
      votingEnd: '2024-01-20',
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      title: 'Treasury Investment in DeFi',
      description: 'Invest 50 ETH from the treasury into a diversified DeFi portfolio to generate additional revenue.',
      proposer: '0xabcd...efgh',
      type: 'TREASURY',
      status: 'defeated',
      forVotes: '35.1',
      againstVotes: '42.3',
      abstainVotes: '22.6',
      quorum: '50.0',
      votingEnd: '2024-01-25',
      createdAt: '2024-01-05'
    }
  ]
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <Clock className="h-4 w-4 text-blue-500" />
    case 'succeeded':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'defeated':
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-blue-100 text-blue-800'
    case 'succeeded':
      return 'bg-green-100 text-green-800'
    case 'defeated':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function DAOPage() {
  const { isConnected, address } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to participate in DAO governance
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                DAO Governance
              </h1>
              <p className="text-gray-600 mt-2">
                Participate in community-driven decisions and shape the future of IdeaForge.
              </p>
            </div>
            <Button className="btn-dao">
              <Plus className="h-4 w-4 mr-2" />
              Create Proposal
            </Button>
          </div>
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
              <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.stats.totalProposals}</div>
              <p className="text-xs text-muted-foreground">
                +3 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.stats.activeProposals}</div>
              <p className="text-xs text-muted-foreground">
                Currently voting
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.stats.totalVotes}</div>
              <p className="text-xs text-muted-foreground">
                Community participation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Treasury Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.stats.treasuryBalance} ETH</div>
              <p className="text-xs text-muted-foreground">
                Available funds
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Proposals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">Recent Proposals</h2>
          
          <div className="grid gap-6">
            {mockData.proposals.map((proposal) => (
              <Card key={proposal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(proposal.status)}
                        <CardTitle className="text-lg">{proposal.title}</CardTitle>
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status}
                        </Badge>
                      </div>
                      <CardDescription className="mt-2">
                        {proposal.description}
                      </CardDescription>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                        <span>Proposed by: {proposal.proposer}</span>
                        <span>•</span>
                        <span>Type: {proposal.type}</span>
                        <span>•</span>
                        <span>Created: {proposal.createdAt}</span>
                        {proposal.status === 'active' && (
                          <>
                            <span>•</span>
                            <span>Ends: {proposal.votingEnd}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Voting Results */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>For: {proposal.forVotes}%</span>
                        <span>Against: {proposal.againstVotes}%</span>
                        <span>Abstain: {proposal.abstainVotes}%</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex">
                          <div 
                            className="h-2 bg-green-500 rounded-l"
                            style={{ width: `${proposal.forVotes}%` }}
                          />
                          <div 
                            className="h-2 bg-red-500"
                            style={{ width: `${proposal.againstVotes}%` }}
                          />
                          <div 
                            className="h-2 bg-gray-400 rounded-r"
                            style={{ width: `${proposal.abstainVotes}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Quorum: {proposal.quorum}% required
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Vote className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {proposal.status === 'active' && (
                          <Button size="sm" className="btn-dao">
                            <Vote className="h-4 w-4 mr-2" />
                            Vote
                          </Button>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {proposal.status === 'active' ? 'Voting in progress' : 'Voting ended'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
