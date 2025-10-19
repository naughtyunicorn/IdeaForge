import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ipfsService } from '@/services/ipfsService'
import { APIResponse } from '@/types'

const uploadFileSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  content: z.string() // base64 encoded
})

const uploadJSONSchema = z.object({
  metadata: z.any()
})

const pinHashSchema = z.object({
  hash: z.string().min(1)
})

export async function ipfsRoutes(fastify: FastifyInstance) {
  // Upload file to IPFS
  fastify.post('/upload-file', {
    schema: {
      description: 'Upload a file to IPFS',
      tags: ['IPFS'],
      body: uploadFileSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                hash: { type: 'string' },
                size: { type: 'number' },
                url: { type: 'string' },
                pinSize: { type: 'number' },
                timestamp: { type: 'number' }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { filename, contentType, content } = uploadFileSchema.parse(request.body)
      
      const buffer = Buffer.from(content, 'base64')
      const result = await ipfsService.uploadFile(buffer, filename, contentType)
      
      const response: APIResponse = {
        success: true,
        data: result,
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('IPFS file upload error:', error)
      throw error
    }
  })

  // Upload JSON to IPFS
  fastify.post('/upload-json', {
    schema: {
      description: 'Upload JSON metadata to IPFS',
      tags: ['IPFS'],
      body: uploadJSONSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                hash: { type: 'string' },
                size: { type: 'number' },
                url: { type: 'string' },
                pinSize: { type: 'number' },
                timestamp: { type: 'number' }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { metadata } = uploadJSONSchema.parse(request.body)
      
      const result = await ipfsService.uploadJSON(metadata)
      
      const response: APIResponse = {
        success: true,
        data: result,
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('IPFS JSON upload error:', error)
      throw error
    }
  })

  // Pin hash
  fastify.post('/pin', {
    schema: {
      description: 'Pin a hash to IPFS',
      tags: ['IPFS'],
      body: pinHashSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                hash: { type: 'string' },
                pinned: { type: 'boolean' }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { hash } = pinHashSchema.parse(request.body)
      
      const pinned = await ipfsService.pinHash(hash)
      
      const response: APIResponse = {
        success: true,
        data: {
          hash,
          pinned
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('IPFS pin error:', error)
      throw error
    }
  })

  // Verify hash
  fastify.get('/verify/:hash', {
    schema: {
      description: 'Verify if a hash exists on IPFS',
      tags: ['IPFS'],
      params: z.object({
        hash: z.string().min(1)
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                hash: { type: 'string' },
                exists: { type: 'boolean' }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { hash } = request.params as { hash: string }
      
      const exists = await ipfsService.verifyHash(hash)
      
      const response: APIResponse = {
        success: true,
        data: {
          hash,
          exists
        },
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('IPFS hash verification error:', error)
      throw error
    }
  })
}
