import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { blockchainService } from '@/services/blockchainService'
import { APIResponse } from '@/types'

const licenseIPSchema = z.object({
  tokenId: z.number().int().positive(),
  price: z.string().regex(/^\d+(\.\d+)?$/) // ETH amount
})

export async function nftRoutes(fastify: FastifyInstance) {
  // Get IP-NFT data
  fastify.get('/:tokenId', {
    schema: {
      description: 'Get IP-NFT data by token ID',
      tags: ['NFTs'],
      params: z.object({
        tokenId: z.string().transform(Number)
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                creator: { type: 'string' },
                creationTime: { type: 'number' },
                aiScore: { type: 'number' },
                category: { type: 'string' },
                description: { type: 'string' },
                isLicensed: { type: 'boolean' },
                licensePrice: { type: 'number' }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { tokenId } = request.params as { tokenId: number }
      
      const ipData = await blockchainService.getIPNFTData(tokenId)
      
      const response: APIResponse = {
        success: true,
        data: ipData,
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Get IP-NFT data error:', error)
      throw error
    }
  })

  // Get creator's tokens
  fastify.get('/creator/:address', {
    schema: {
      description: 'Get all IP-NFTs created by an address',
      tags: ['NFTs'],
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
      
      const tokens = await blockchainService.getCreatorTokens(address)
      
      const response: APIResponse = {
        success: true,
        data: tokens,
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Get creator tokens error:', error)
      throw error
    }
  })

  // License IP
  fastify.post('/license', {
    schema: {
      description: 'License an IP-NFT',
      tags: ['NFTs'],
      body: licenseIPSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                tokenId: { type: 'number' },
                price: { type: 'string' },
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
      const { tokenId, price } = licenseIPSchema.parse(request.body)
      
      const txHash = await blockchainService.licenseIP(tokenId, price)
      
      const response: APIResponse = {
        success: true,
        data: {
          tokenId,
          price,
          txHash
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('IP licensing error:', error)
      throw error
    }
  })
}
