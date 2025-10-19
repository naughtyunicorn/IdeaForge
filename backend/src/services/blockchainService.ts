import { ethers } from 'ethers'
import { config } from '@/config'
import { logger } from '@/utils/logger'
import { contracts } from './contracts'

export class BlockchainService {
  private provider: ethers.JsonRpcProvider
  private wallet: ethers.Wallet
  private contracts: any

  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.POLYGON_RPC_URL)
    this.wallet = new ethers.Wallet(config.PRIVATE_KEY, this.provider)
    this.contracts = this.initializeContracts()
  }

  private initializeContracts() {
    return {
      forgeToken: new ethers.Contract(
        config.FORGE_TOKEN_ADDRESS,
        contracts.ForgeToken.abi,
        this.wallet
      ),
      ipNFT: new ethers.Contract(
        config.IP_NFT_ADDRESS,
        contracts.IPNFT.abi,
        this.wallet
      ),
      ideaForgeCore: new ethers.Contract(
        config.IDEA_FORGE_CORE_ADDRESS,
        contracts.IdeaForgeCore.abi,
        this.wallet
      ),
      dao: new ethers.Contract(
        config.DAO_ADDRESS,
        contracts.IdeaForgeDAO.abi,
        this.wallet
      ),
      revenueSplitter: new ethers.Contract(
        config.REVENUE_SPLITTER_ADDRESS,
        contracts.RevenueSplitter.abi,
        this.wallet
      )
    }
  }

  async submitIdea(
    title: string,
    description: string,
    category: string,
    contentHash: string,
    metadataHash: string,
    submissionFee: string
  ): Promise<string> {
    try {
      const tx = await this.contracts.ideaForgeCore.submitIdea(
        title,
        description,
        category,
        contentHash,
        metadataHash,
        { value: ethers.parseEther(submissionFee) }
      )

      const receipt = await tx.wait()
      
      logger.info('Idea submitted to blockchain', {
        txHash: tx.hash,
        blockNumber: receipt.blockNumber
      })

      return tx.hash
    } catch (error) {
      logger.error('Idea submission failed:', error)
      throw new Error('Failed to submit idea to blockchain')
    }
  }

  async approveIdea(
    ideaId: number,
    aiCredibilityScore: number,
    validationNotes: string
  ): Promise<string> {
    try {
      const tx = await this.contracts.ideaForgeCore.approveIdea(
        ideaId,
        aiCredibilityScore,
        validationNotes
      )

      const receipt = await tx.wait()
      
      logger.info('Idea approved on blockchain', {
        ideaId,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber
      })

      return tx.hash
    } catch (error) {
      logger.error('Idea approval failed:', error)
      throw new Error('Failed to approve idea on blockchain')
    }
  }

  async mintIPNFT(
    ideaId: number,
    tokenURI: string,
    royaltyFee: number
  ): Promise<{ txHash: string; tokenId: number }> {
    try {
      const tx = await this.contracts.ideaForgeCore.mintIPNFT(
        ideaId,
        tokenURI,
        royaltyFee
      )

      const receipt = await tx.wait()
      
      // Extract token ID from events
      const mintEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = this.contracts.ipNFT.interface.parseLog(log)
          return parsed?.name === 'IPNFTCreated'
        } catch {
          return false
        }
      })

      let tokenId = 0
      if (mintEvent) {
        const parsed = this.contracts.ipNFT.interface.parseLog(mintEvent)
        tokenId = Number(parsed?.args.tokenId)
      }

      logger.info('IP-NFT minted on blockchain', {
        ideaId,
        tokenId,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber
      })

      return { txHash: tx.hash, tokenId }
    } catch (error) {
      logger.error('IP-NFT minting failed:', error)
      throw new Error('Failed to mint IP-NFT on blockchain')
    }
  }

  async getIdeaSubmission(ideaId: number): Promise<any> {
    try {
      const submission = await this.contracts.ideaForgeCore.getIdeaSubmission(ideaId)
      
      return {
        ideaId: Number(submission.ideaId),
        submitter: submission.submitter,
        title: submission.title,
        description: submission.description,
        category: submission.category,
        contentHash: submission.contentHash,
        metadataHash: submission.metadataHash,
        submissionTime: Number(submission.submissionTime),
        aiCredibilityScore: Number(submission.aiCredibilityScore),
        isApproved: submission.isApproved,
        isMinted: submission.isMinted,
        validator: submission.validator,
        validationNotes: submission.validationNotes,
        mintedTokenId: Number(submission.mintedTokenId)
      }
    } catch (error) {
      logger.error('Failed to get idea submission:', error)
      throw new Error('Failed to retrieve idea submission from blockchain')
    }
  }

  async getUserSubmissions(userAddress: string): Promise<number[]> {
    try {
      const submissions = await this.contracts.ideaForgeCore.getUserSubmissions(userAddress)
      return submissions.map((id: any) => Number(id))
    } catch (error) {
      logger.error('Failed to get user submissions:', error)
      throw new Error('Failed to retrieve user submissions from blockchain')
    }
  }

  async getIPNFTData(tokenId: number): Promise<any> {
    try {
      const ipData = await this.contracts.ipNFT.getIPData(tokenId)
      
      return {
        creator: ipData.creator,
        creationTime: Number(ipData.creationTime),
        aiScore: Number(ipData.aiScore),
        category: ipData.category,
        description: ipData.description,
        isLicensed: ipData.isLicensed,
        licensePrice: Number(ipData.licensePrice)
      }
    } catch (error) {
      logger.error('Failed to get IP-NFT data:', error)
      throw new Error('Failed to retrieve IP-NFT data from blockchain')
    }
  }

  async getCreatorTokens(creatorAddress: string): Promise<number[]> {
    try {
      const tokens = await this.contracts.ipNFT.getCreatorTokens(creatorAddress)
      return tokens.map((id: any) => Number(id))
    } catch (error) {
      logger.error('Failed to get creator tokens:', error)
      throw new Error('Failed to retrieve creator tokens from blockchain')
    }
  }

  async licenseIP(tokenId: number, price: string): Promise<string> {
    try {
      const tx = await this.contracts.ipNFT.licenseIP(tokenId, {
        value: ethers.parseEther(price)
      })

      const receipt = await tx.wait()
      
      logger.info('IP licensed on blockchain', {
        tokenId,
        price,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber
      })

      return tx.hash
    } catch (error) {
      logger.error('IP licensing failed:', error)
      throw new Error('Failed to license IP on blockchain')
    }
  }

  async getForgeTokenBalance(address: string): Promise<string> {
    try {
      const balance = await this.contracts.forgeToken.balanceOf(address)
      return ethers.formatEther(balance)
    } catch (error) {
      logger.error('Failed to get FORGE token balance:', error)
      throw new Error('Failed to retrieve FORGE token balance')
    }
  }

  async getVotingPower(address: string): Promise<string> {
    try {
      const votes = await this.contracts.forgeToken.getVotes(address)
      return ethers.formatEther(votes)
    } catch (error) {
      logger.error('Failed to get voting power:', error)
      throw new Error('Failed to retrieve voting power')
    }
  }

  async createDAOProposal(
    targets: string[],
    values: string[],
    calldatas: string[],
    description: string,
    proposalType: number,
    title: string,
    externalLink: string
  ): Promise<string> {
    try {
      const tx = await this.contracts.dao.proposeWithMetadata(
        targets,
        values,
        calldatas,
        description,
        proposalType,
        title,
        externalLink
      )

      const receipt = await tx.wait()
      
      logger.info('DAO proposal created', {
        txHash: tx.hash,
        blockNumber: receipt.blockNumber
      })

      return tx.hash
    } catch (error) {
      logger.error('DAO proposal creation failed:', error)
      throw new Error('Failed to create DAO proposal')
    }
  }

  async voteOnProposal(proposalId: number, support: number): Promise<string> {
    try {
      const tx = await this.contracts.dao.castVote(proposalId, support)
      const receipt = await tx.wait()
      
      logger.info('Vote cast on DAO proposal', {
        proposalId,
        support,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber
      })

      return tx.hash
    } catch (error) {
      logger.error('DAO voting failed:', error)
      throw new Error('Failed to vote on DAO proposal')
    }
  }

  async getProposalState(proposalId: number): Promise<number> {
    try {
      const state = await this.contracts.dao.state(proposalId)
      return Number(state)
    } catch (error) {
      logger.error('Failed to get proposal state:', error)
      throw new Error('Failed to retrieve proposal state')
    }
  }

  async getCreatorEarnings(creatorAddress: string): Promise<string> {
    try {
      const earnings = await this.contracts.revenueSplitter.getCreatorEarnings(creatorAddress)
      return ethers.formatEther(earnings)
    } catch (error) {
      logger.error('Failed to get creator earnings:', error)
      throw new Error('Failed to retrieve creator earnings')
    }
  }

  async claimCreatorEarnings(amount: string): Promise<string> {
    try {
      const tx = await this.contracts.revenueSplitter.claimCreatorEarnings(
        ethers.parseEther(amount)
      )

      const receipt = await tx.wait()
      
      logger.info('Creator earnings claimed', {
        amount,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber
      })

      return tx.hash
    } catch (error) {
      logger.error('Creator earnings claim failed:', error)
      throw new Error('Failed to claim creator earnings')
    }
  }

  async getCurrentBlockNumber(): Promise<number> {
    try {
      const blockNumber = await this.provider.getBlockNumber()
      return blockNumber
    } catch (error) {
      logger.error('Failed to get current block number:', error)
      throw new Error('Failed to retrieve current block number')
    }
  }

  async getTransactionReceipt(txHash: string): Promise<any> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash)
      return receipt
    } catch (error) {
      logger.error('Failed to get transaction receipt:', error)
      throw new Error('Failed to retrieve transaction receipt')
    }
  }
}

export const blockchainService = new BlockchainService()
