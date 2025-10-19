import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { blockchainService } from '@/services/blockchainService'
import { APIResponse } from '@/types'

const createProposalSchema = z.object({
  targets: z.array(z.string()),
  values: z.array(z.string()),
  calldatas: z.array(z.string()),
  description: z.string().min(1).max(1000),
  proposalType: z.number().int().min(0).max(4),
  title: z.string().min(1).max(200),
  externalLink: z.string().url().optional()
})

const voteSchema = z.object({
  proposalId: z.number().int().positive(),
  support: z.number().int().min(0).max(2) // 0: against, 1: for, 2: abstain
})

export async function daoRoutes(fastify: FastifyInstance) {
  // Create DAO proposal
  fastify.post('/proposals', {
    schema: {
      description: 'Create a new DAO proposal',
      tags: ['DAO'],
      body: createProposalSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                proposalId: { type: 'number' },
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
      const { targets, values, calldatas, description, proposalType, title, externalLink } = createProposalSchema.parse(request.body)
      
      const txHash = await blockchainService.createDAOProposal(
        targets,
        values,
        calldatas,
        description,
        proposalType,
        title,
        externalLink || ''
      )
      
      const response: APIResponse = {
        success: true,
        data: {
          proposalId: 0, // Would be returned from blockchain
          txHash
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('DAO proposal creation error:', error)
      throw error
    }
  })

  // Vote on proposal
  fastify.post('/vote', {
    schema: {
      description: 'Vote on a DAO proposal',
      tags: ['DAO'],
      body: voteSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                proposalId: { type: 'number' },
                support: { type: 'number' },
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
      const { proposalId, support } = voteSchema.parse(request.body)
      
      const txHash = await blockchainService.voteOnProposal(proposalId, support)
      
      const response: APIResponse = {
        success: true,
        data: {
          proposalId,
          support,
          txHash
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('DAO voting error:', error)
      throw error
    }
  })

  // Get proposal state
  fastify.get('/proposals/:proposalId/state', {
    schema: {
      description: 'Get the current state of a DAO proposal',
      tags: ['DAO'],
      params: z.object({
        proposalId: z.string().transform(Number)
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                proposalId: { type: 'number' },
                state: { type: 'number' }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { proposalId } = request.params as { proposalId: number }
      
      const state = await blockchainService.getProposalState(proposalId)
      
      const response: APIResponse = {
        success: true,
        data: {
          proposalId,
          state
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Get proposal state error:', error)
      throw error
    }
  })

  // Get voting power
  fastify.get('/voting-power/:address', {
    schema: {
      description: 'Get voting power for an address',
      tags: ['DAO'],
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
                votingPower: { type: 'string' }
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
      
      const votingPower = await blockchainService.getVotingPower(address)
      
      const response: APIResponse = {
        success: true,
        data: {
          address,
          votingPower
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Get voting power error:', error)
      throw error
    }
  })
}
