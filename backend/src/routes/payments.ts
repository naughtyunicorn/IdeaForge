import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { blockchainService } from '@/services/blockchainService'
import { APIResponse } from '@/types'

const claimEarningsSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d+)?$/) // ETH amount
})

export async function paymentRoutes(fastify: FastifyInstance) {
  // Get creator earnings
  fastify.get('/earnings/:address', {
    schema: {
      description: 'Get creator earnings',
      tags: ['Payments'],
      params: z.object({
        address: z.string().regex(/^0x[a-fA-F0-9]{40}$/)
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                address: { type: 'string' },
                earnings: { type: 'string' }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { address } = request.params as { address: string }
      
      const earnings = await blockchainService.getCreatorEarnings(address)
      
      const response: APIResponse = {
        success: true,
        data: {
          address,
          earnings
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Get creator earnings error:', error)
      throw error
    }
  })

  // Claim creator earnings
  fastify.post('/claim-earnings', {
    schema: {
      description: 'Claim creator earnings',
      tags: ['Payments'],
      body: claimEarningsSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                amount: { type: 'string' },
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
      const { amount } = claimEarningsSchema.parse(request.body)
      
      const txHash = await blockchainService.claimCreatorEarnings(amount)
      
      const response: APIResponse = {
        success: true,
        data: {
          amount,
          txHash
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Claim creator earnings error:', error)
      throw error
    }
  })
}
