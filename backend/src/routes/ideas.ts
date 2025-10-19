import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { blockchainService } from '@/services/blockchainService'
import { aiService } from '@/services/aiService'
import { ipfsService } from '@/services/ipfsService'
import { APIResponse, IdeaSubmission } from '@/types'

const submitIdeaSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  category: z.string().min(1).max(50),
  content: z.string().optional(),
  files: z.array(z.object({
    name: z.string(),
    type: z.string(),
    content: z.string() // base64 encoded
  })).optional()
})

const approveIdeaSchema = z.object({
  ideaId: z.number().int().positive(),
  aiCredibilityScore: z.number().min(0).max(100),
  validationNotes: z.string().min(1).max(1000)
})

const mintIPNFTSchema = z.object({
  ideaId: z.number().int().positive(),
  tokenURI: z.string().url(),
  royaltyFee: z.number().min(0).max(1000) // basis points
})

export async function ideaRoutes(fastify: FastifyInstance) {
  // Submit a new idea
  fastify.post('/submit', {
    schema: {
      description: 'Submit a new idea for validation and potential minting',
      tags: ['Ideas'],
      body: submitIdeaSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                ideaId: { type: 'number' },
                txHash: { type: 'string' },
                contentHash: { type: 'string' },
                metadataHash: { type: 'string' }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { title, description, category, content, files } = submitIdeaSchema.parse(request.body)
      
      // Upload files to IPFS if provided
      let contentHash = ''
      let metadataHash = ''
      
      if (files && files.length > 0) {
        const fileUploads = files.map(file => ({
          name: file.name,
          type: file.type,
          content: file.content,
          size: Buffer.from(file.content, 'base64').length
        }))
        
        const uploadResults = await ipfsService.uploadMultipleFiles(fileUploads)
        contentHash = uploadResults[0]?.hash || '' // Use first file as primary content
      }
      
      // Generate metadata
      const metadata = {
        title,
        description,
        category,
        content,
        submittedAt: Date.now(),
        version: '1.0'
      }
      
      const metadataResult = await ipfsService.uploadJSON(metadata)
      metadataHash = metadataResult.hash
      
      // Submit to blockchain
      const submissionFee = '0.001' // 0.001 ETH
      const txHash = await blockchainService.submitIdea(
        title,
        description,
        category,
        contentHash,
        metadataHash,
        submissionFee
      )
      
      const response: APIResponse = {
        success: true,
        data: {
          ideaId: 0, // Would be returned from blockchain
          txHash,
          contentHash,
          metadataHash
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Idea submission error:', error)
      throw error
    }
  })

  // Approve an idea
  fastify.post('/approve', {
    schema: {
      description: 'Approve an idea for minting',
      tags: ['Ideas'],
      body: approveIdeaSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                ideaId: { type: 'number' },
                txHash: { type: 'string' }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { ideaId, aiCredibilityScore, validationNotes } = approveIdeaSchema.parse(request.body)
      
      const txHash = await blockchainService.approveIdea(ideaId, aiCredibilityScore, validationNotes)
      
      const response: APIResponse = {
        success: true,
        data: {
          ideaId,
          txHash
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Idea approval error:', error)
      throw error
    }
  })

  // Mint IP-NFT for approved idea
  fastify.post('/mint-ipnft', {
    schema: {
      description: 'Mint IP-NFT for an approved idea',
      tags: ['Ideas'],
      body: mintIPNFTSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                ideaId: { type: 'number' },
                tokenId: { type: 'number' },
                txHash: { type: 'string' }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { ideaId, tokenURI, royaltyFee } = mintIPNFTSchema.parse(request.body)
      
      const result = await blockchainService.mintIPNFT(ideaId, tokenURI, royaltyFee)
      
      const response: APIResponse = {
        success: true,
        data: {
          ideaId,
          tokenId: result.tokenId,
          txHash: result.txHash
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('IP-NFT minting error:', error)
      throw error
    }
  })

  // Get idea submission details
  fastify.get('/:ideaId', {
    schema: {
      description: 'Get idea submission details',
      tags: ['Ideas'],
      params: z.object({
        ideaId: z.string().transform(Number)
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                ideaId: { type: 'number' },
                submitter: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                category: { type: 'string' },
                contentHash: { type: 'string' },
                metadataHash: { type: 'string' },
                submissionTime: { type: 'number' },
                aiCredibilityScore: { type: 'number' },
                isApproved: { type: 'boolean' },
                isMinted: { type: 'boolean' },
                validator: { type: 'string' },
                validationNotes: { type: 'string' },
                mintedTokenId: { type: 'number' }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { ideaId } = request.params as { ideaId: number }
      
      const submission = await blockchainService.getIdeaSubmission(ideaId)
      
      const response: APIResponse = {
        success: true,
        data: submission,
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Get idea submission error:', error)
      throw error
    }
  })

  // Get user's submissions
  fastify.get('/user/:address', {
    schema: {
      description: 'Get all submissions by a user',
      tags: ['Ideas'],
      params: z.object({
        address: z.string().regex(/^0x[a-fA-F0-9]{40}$/)
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: { type: 'number' }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { address } = request.params as { address: string }
      
      const submissions = await blockchainService.getUserSubmissions(address)
      
      const response: APIResponse = {
        success: true,
        data: submissions,
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Get user submissions error:', error)
      throw error
    }
  })
}
