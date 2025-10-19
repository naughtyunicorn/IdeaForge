import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { APIResponse } from '@/types'

const authSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string().min(1),
  message: z.string().min(1)
})

export async function authRoutes(fastify: FastifyInstance) {
  // Authenticate user with wallet signature
  fastify.post('/wallet', {
    schema: {
      description: 'Authenticate user with wallet signature',
      tags: ['Auth'],
      body: authSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                user: {
                  type: 'object',
                  properties: {
                    address: { type: 'string' },
                    authenticated: { type: 'boolean' }
                  }
                }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { address, signature, message } = authSchema.parse(request.body)
      
      // In a real implementation, you would verify the signature here
      // For now, we'll just return a mock response
      
      const response: APIResponse = {
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            address,
            authenticated: true
          }
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Wallet authentication error:', error)
      throw error
    }
  })

  // Verify authentication token
  fastify.get('/verify', {
    schema: {
      description: 'Verify authentication token',
      tags: ['Auth'],
      headers: z.object({
        authorization: z.string()
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                valid: { type: 'boolean' },
                user: {
                  type: 'object',
                  properties: {
                    address: { type: 'string' }
                  }
                }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization
      
      // In a real implementation, you would verify the JWT token here
      // For now, we'll just return a mock response
      
      const response: APIResponse = {
        success: true,
        data: {
          valid: true,
          user: {
            address: '0x0000000000000000000000000000000000000000'
          }
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Token verification error:', error)
      throw error
    }
  })
}
