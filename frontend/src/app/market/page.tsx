'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Star, 
  Eye, 
  Download, 
  Share2,
  TrendingUp,
  Clock,
  DollarSign,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'

// Mock data - in real app, this would come from API
const mockData = {
  categories: [
    { value: 'all', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'art', label: 'Art & Design' },
    { value: 'music', label: 'Music & Audio' },
    { value: 'video', label: 'Video & Media' },
    { value: 'business', label: 'Business' },
    { value: 'science', label: 'Science' }
  ],
  sortOptions: [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'ai-score', label: 'AI Score' },
    { value: 'popular', label: 'Most Popular' }
  ],
  ipnfts: [
    {
      id: 1,
      tokenId: 123,
      title: 'AI-Powered Code Review Tool',
      description: 'An intelligent code review system that uses machine learning to identify bugs, security vulnerabilities, and code quality issues.',
      category: 'Technology',
      creator: '0x1234...5678',
      aiScore: 92,
      price: '0.5',
      currency: 'ETH',
      views: 156,
      licenses: 3,
      rating: 4.8,
      image: '/api/placeholder/300/200',
      createdAt: '2024-01-15',
      isLicensed: false
    },
    {
      id: 2,
      tokenId: 456,
      title: 'Sustainable Packaging Design',
      description: 'Innovative eco-friendly packaging solution that reduces waste and carbon footprint while maintaining product integrity.',
      category: 'Art',
      creator: '0x8765...4321',
      aiScore: 88,
      price: '0.3',
      currency: 'ETH',
      views: 89,
      licenses: 1,
      rating: 4.6,
      image: '/api/placeholder/300/200',
      createdAt: '2024-01-10',
      isLicensed: false
    },
    {
      id: 3,
      tokenId: 789,
      title: 'Decentralized Music Streaming Protocol',
      description: 'A blockchain-based music streaming platform that ensures fair compensation for artists and transparent royalty distribution.',
      category: 'Music',
      creator: '0xabcd...efgh',
      aiScore: 85,
      price: '1.2',
      currency: 'ETH',
      views: 234,
      licenses: 5,
      rating: 4.9,
      image: '/api/placeholder/300/200',
      createdAt: '2024-01-08',
      isLicensed: true
    },
    {
      id: 4,
      tokenId: 101,
      title: 'Quantum Computing Algorithm',
      description: 'Advanced quantum algorithm for solving complex optimization problems with exponential speedup over classical methods.',
      category: 'Science',
      creator: '0xefgh...ijkl',
      aiScore: 95,
      price: '2.0',
      currency: 'ETH',
      views: 67,
      licenses: 0,
      rating: 5.0,
      image: '/api/placeholder/300/200',
      createdAt: '2024-01-05',
      isLicensed: false
    }
  ]
}

export default function MarketPage() {
  const { isConnected } = useAccount()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [filteredNFTs, setFilteredNFTs] = useState(mockData.ipnfts)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterNFTs(term, selectedCategory, sortBy)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterNFTs(searchTerm, category, sortBy)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    filterNFTs(searchTerm, selectedCategory, sort)
  }

  const filterNFTs = (search: string, category: string, sort: string) => {
    let filtered = mockData.ipnfts

    // Filter by search term
    if (search) {
      filtered = filtered.filter(nft => 
        nft.title.toLowerCase().includes(search.toLowerCase()) ||
        nft.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(nft => nft.category.toLowerCase() === category)
    }

    // Sort
    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        break
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        break
      case 'ai-score':
        filtered.sort((a, b) => b.aiScore - a.aiScore)
        break
      case 'popular':
        filtered.sort((a, b) => b.views - a.views)
        break
    }

    setFilteredNFTs(filtered)
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            IP-NFT Marketplace
          </h1>
          <p className="text-gray-600">
            Discover and license innovative intellectual property from creators worldwide.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search IP-NFTs..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredNFTs.length} IP-NFTs found
            </h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Filters applied</span>
            </div>
          </div>
        </motion.div>

        {/* IP-NFTs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredNFTs.map((nft) => (
            <Card key={nft.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-0">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-forge-100 to-nft-100 rounded-t-lg flex items-center justify-center">
                    <Zap className="h-12 w-12 text-forge-600" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90">
                      {nft.category}
                    </Badge>
                  </div>
                  {nft.isLicensed && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-green-500">
                        Licensed
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <CardTitle className="text-lg line-clamp-1">{nft.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {nft.description}
                    </CardDescription>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{nft.rating}</span>
                    </div>
                    <Badge variant="outline">
                      AI: {nft.aiScore}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div className="text-center">
                      <div className="font-medium">{nft.views}</div>
                      <div>Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{nft.licenses}</div>
                      <div>Licenses</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{nft.price} ETH</div>
                      <div>Price</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      className="btn-nft"
                      disabled={nft.isLicensed}
                    >
                      {nft.isLicensed ? 'Licensed' : 'License'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Load More */}
        {filteredNFTs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg">
              Load More IP-NFTs
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredNFTs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center py-12"
          >
            <Zap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No IP-NFTs found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSortBy('newest')
              setFilteredNFTs(mockData.ipnfts)
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
