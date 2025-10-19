export interface IdeaSubmission {
  id: string
  title: string
  description: string
  category: string
  contentHash: string
  metadataHash: string
  submitter: string
  submissionTime: number
  aiCredibilityScore?: number
  isApproved: boolean
  isMinted: boolean
  validator?: string
  validationNotes?: string
  mintedTokenId?: number
  files: FileUpload[]
  status: 'pending' | 'approved' | 'rejected' | 'minted'
}

export interface FileUpload {
  id: string
  name: string
  type: string
  size: number
  ipfsHash: string
  url: string
  uploadedAt: number
}

export interface IPNFT {
  id: string
  tokenId: number
  creator: string
  owner: string
  title: string
  description: string
  category: string
  aiCredibilityScore: number
  creationTime: number
  isLicensed: boolean
  licensePrice?: number
  royaltyFee: number
  tokenURI: string
  collaborators: Collaborator[]
  metadata: IPNFTMetadata
}

export interface Collaborator {
  address: string
  share: number // in basis points
  name?: string
}

export interface IPNFTMetadata {
  name: string
  description: string
  image: string
  external_url?: string
  attributes: Attribute[]
  properties: {
    category: string
    ai_score: number
    creator: string
    created_at: number
    license_price?: number
    royalty_fee: number
  }
}

export interface Attribute {
  trait_type: string
  value: string | number
  display_type?: string
}

export interface DAOProposal {
  id: string
  proposer: string
  title: string
  description: string
  externalLink?: string
  proposalType: 'GENERAL' | 'TREASURY' | 'PLATFORM' | 'CATEGORY' | 'EMERGENCY'
  targets: string[]
  values: string[]
  calldatas: string[]
  createdAt: number
  votingStart: number
  votingEnd: number
  status: 'pending' | 'active' | 'succeeded' | 'defeated' | 'executed' | 'canceled'
  forVotes: string
  againstVotes: string
  abstainVotes: string
  quorum: string
  executionTime?: number
}

export interface User {
  id: string
  address: string
  email?: string
  name?: string
  avatar?: string
  bio?: string
  website?: string
  twitter?: string
  joinedAt: number
  totalIdeas: number
  totalIPNFTs: number
  totalEarnings: string
  reputation: number
  isVerified: boolean
}

export interface Revenue {
  id: string
  creator: string
  amount: string
  token: string
  source: 'license' | 'royalty' | 'sale' | 'reward'
  timestamp: number
  transactionHash?: string
  status: 'pending' | 'completed' | 'failed'
}

export interface AIValidationResult {
  score: number
  originality: number
  quality: number
  marketPotential: number
  category: string
  suggestions: string[]
  risks: string[]
  confidence: number
  reasoning: string
}

export interface IPFSUploadResult {
  hash: string
  size: number
  url: string
  pinSize: number
  timestamp: number
}

export interface StripePaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
}

export interface DatabaseError extends Error {
  code?: string
  constraint?: string
  detail?: string
  hint?: string
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: number
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
