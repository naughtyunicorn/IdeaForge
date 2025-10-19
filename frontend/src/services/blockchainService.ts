import { ethers } from 'ethers'

export interface ContractAddresses {
  forgeToken: string
  ipnft: string
  ideaForgeCore: string
  ideaForgeDAO: string
  revenueSplitter: string
}

export interface IdeaSubmission {
  title: string
  description: string
  category: string
  ipfsHash: string
  aiScore: number
}

export interface IPNFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  external_url: string
  animation_url?: string
}

class BlockchainService {
  private provider: ethers.Provider
  private signer: ethers.Signer | null = null
  private contracts: any = {}
  private addresses: ContractAddresses

  constructor() {
    // Initialize with Mumbai testnet
    this.provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://polygon-mumbai.g.alchemy.com/v2/demo'
    )
    
    this.addresses = {
      forgeToken: process.env.NEXT_PUBLIC_FORGE_TOKEN_ADDRESS || '',
      ipnft: process.env.NEXT_PUBLIC_IPNFT_ADDRESS || '',
      ideaForgeCore: process.env.NEXT_PUBLIC_IDEA_FORGE_CORE_ADDRESS || '',
      ideaForgeDAO: process.env.NEXT_PUBLIC_IDEA_FORGE_DAO_ADDRESS || '',
      revenueSplitter: process.env.NEXT_PUBLIC_REVENUE_SPLITTER_ADDRESS || '',
    }
  }

  async connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await provider.getSigner()
    } else {
      throw new Error('MetaMask not found')
    }
  }

  async submitIdea(idea: IdeaSubmission): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected')
    }

    try {
      // This would interact with the IdeaForgeCore contract
      // For now, return a mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
      return txHash
    } catch (error) {
      console.error('Idea submission failed:', error)
      throw new Error('Failed to submit idea')
    }
  }

  async mintIPNFT(idea: IdeaSubmission, metadata: IPNFTMetadata): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected')
    }

    try {
      // This would interact with the IPNFT contract
      // For now, return a mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
      return txHash
    } catch (error) {
      console.error('IP-NFT minting failed:', error)
      throw new Error('Failed to mint IP-NFT')
    }
  }

  async getIPNFTMetadata(tokenId: string): Promise<IPNFTMetadata> {
    try {
      // This would fetch metadata from the IPNFT contract
      // For now, return mock data
      return {
        name: 'Sample IP-NFT',
        description: 'A sample intellectual property NFT',
        image: 'https://via.placeholder.com/300x300',
        attributes: [
          { trait_type: 'AI Score', value: 85 },
          { trait_type: 'Category', value: 'Technology' },
          { trait_type: 'Rarity', value: 'Rare' }
        ],
        external_url: 'https://ideaforge.io/nft/' + tokenId
      }
    } catch (error) {
      console.error('Failed to fetch IP-NFT metadata:', error)
      throw new Error('Failed to fetch IP-NFT metadata')
    }
  }

  async getForgeTokenBalance(address: string): Promise<string> {
    try {
      // This would interact with the ForgeToken contract
      // For now, return mock balance
      return '1000.0'
    } catch (error) {
      console.error('Failed to fetch token balance:', error)
      throw new Error('Failed to fetch token balance')
    }
  }

  async getDAOVotingPower(address: string): Promise<string> {
    try {
      // This would interact with the IdeaForgeDAO contract
      // For now, return mock voting power
      return '500.0'
    } catch (error) {
      console.error('Failed to fetch voting power:', error)
      throw new Error('Failed to fetch voting power')
    }
  }

  async createDAOProposal(
    title: string,
    description: string,
    targets: string[],
    values: string[],
    calldatas: string[]
  ): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected')
    }

    try {
      // This would interact with the IdeaForgeDAO contract
      // For now, return a mock proposal ID
      const proposalId = Math.floor(Math.random() * 1000000)
      return proposalId.toString()
    } catch (error) {
      console.error('Proposal creation failed:', error)
      throw new Error('Failed to create proposal')
    }
  }

  async voteOnProposal(proposalId: string, support: number): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected')
    }

    try {
      // This would interact with the IdeaForgeDAO contract
      // For now, return a mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
      return txHash
    } catch (error) {
      console.error('Voting failed:', error)
      throw new Error('Failed to vote on proposal')
    }
  }

  async getProposalDetails(proposalId: string): Promise<{
    id: string
    proposer: string
    title: string
    description: string
    status: string
    forVotes: string
    againstVotes: string
    abstainVotes: string
    startBlock: number
    endBlock: number
  }> {
    try {
      // This would fetch proposal details from the IdeaForgeDAO contract
      // For now, return mock data
      return {
        id: proposalId,
        proposer: '0x1234567890123456789012345678901234567890',
        title: 'Sample Proposal',
        description: 'This is a sample proposal for testing purposes',
        status: 'Active',
        forVotes: '1000',
        againstVotes: '200',
        abstainVotes: '50',
        startBlock: 1000000,
        endBlock: 1001000
      }
    } catch (error) {
      console.error('Failed to fetch proposal details:', error)
      throw new Error('Failed to fetch proposal details')
    }
  }

  async getTransactionStatus(txHash: string): Promise<{
    status: 'pending' | 'confirmed' | 'failed'
    blockNumber?: number
    gasUsed?: string
  }> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash)
      
      if (!receipt) {
        return { status: 'pending' }
      }

      return {
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      }
    } catch (error) {
      console.error('Failed to get transaction status:', error)
      throw new Error('Failed to get transaction status')
    }
  }

  async estimateGas(contractAddress: string, abi: any, method: string, params: any[]): Promise<string> {
    try {
      const contract = new ethers.Contract(contractAddress, abi, this.provider)
      const gasEstimate = await (contract as any)[method].estimateGas(...params)
      return gasEstimate.toString()
    } catch (error) {
      console.error('Gas estimation failed:', error)
      throw new Error('Failed to estimate gas')
    }
  }
}

export const blockchainService = new BlockchainService()
