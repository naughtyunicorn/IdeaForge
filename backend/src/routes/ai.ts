import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { aiService } from '@/services/aiService'
import { APIResponse } from '@/types'

const validateIdeaSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  category: z.string().min(1).max(50),
  content: z.string().optional()
})

const analyzeContentSchema = z.object({
  content: z.string().min(1),
  contentType: z.string().min(1)
})

const generateMetadataSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  category: z.string().min(1).max(50),
  aiScore: z.number().min(0).max(100)
})

export async function aiRoutes(fastify: FastifyInstance) {
  // Validate idea with AI
  fastify.post('/validate-idea', {
    schema: {
      description: 'Validate an idea using AI analysis',
      tags: ['AI'],
      body: validateIdeaSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                score: { type: 'number' },
                originality: { type: 'number' },
                quality: { type: 'number' },
                marketPotential: { type: 'number' },
                category: { type: 'string' },
                suggestions: { type: 'array', items: { type: 'string' } },
                risks: { type: 'array', items: { type: 'string' } },
                confidence: { type: 'number' },
                reasoning: { type: 'string' }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { title, description, category, content } = validateIdeaSchema.parse(request.body)
      
      const result = await aiService.validateIdea(title, description, category, content)
      
      const response: APIResponse = {
        success: true,
        data: result,
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('AI validation error:', error)
      throw error
    }
  })

  // Analyze content
  fastify.post('/analyze-content', {
    schema: {
      description: 'Analyze content for keywords, sentiment, and topics',
      tags: ['AI'],
      body: analyzeContentSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                summary: { type: 'string' },
                keywords: { type: 'array', items: { type: 'string' } },
                sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
                topics: { type: 'array', items: { type: 'string' } }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { content, contentType } = analyzeContentSchema.parse(request.body)
      
      const result = await aiService.analyzeContent(content, contentType)
      
      const response: APIResponse = {
        success: true,
        data: result,
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Content analysis error:', error)
      throw error
    }
  })

  // Generate metadata
  fastify.post('/generate-metadata', {
    schema: {
      description: 'Generate NFT metadata for an idea',
      tags: ['AI'],
      body: generateMetadataSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'string' },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { title, description, category, aiScore } = generateMetadataSchema.parse(request.body)
      
      const metadata = await aiService.generateMetadata(title, description, category, aiScore)
      
      const response: APIResponse = {
        success: true,
        data: metadata,
        timestamp: Date.now()
      }
      
      return reply.send(response)
    } catch (error) {
      console.error('Metadata generation error:', error)
      throw error
    }
  })

  // Health check for AI service
  fastify.get('/health', {
    schema: {
      description: 'Check AI service health',
      tags: ['AI'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                timestamp: { type: 'number' }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const response: APIResponse = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: Date.now()
      },
      timestamp: Date.now()
    }
    
    return reply.send(response)
  })
}
