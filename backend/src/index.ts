import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { config } from '@/config'
import { logger } from '@/utils/logger'
import { errorHandler } from '@/middleware/errorHandler'
import { authRoutes } from '@/routes/auth'
import { ideaRoutes } from '@/routes/ideas'
import { nftRoutes } from '@/routes/nfts'
import { daoRoutes } from '@/routes/dao'
import { paymentRoutes } from '@/routes/payments'
import { aiRoutes } from '@/routes/ai'
import { ipfsRoutes } from '@/routes/ipfs'

const fastify = Fastify({
  logger: {
    level: config.NODE_ENV === 'production' ? 'warn' : 'info',
  },
})

// Register plugins
async function registerPlugins() {
  // CORS
  await fastify.register(cors, {
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
  })

  // Security
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })

  // Rate limiting
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  // Swagger documentation
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'IdeaForge API',
        description: 'API for IP-NFT creation, submission, and monetization platform',
        version: '1.0.0',
      },
      host: config.API_HOST,
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  })
}

// Register routes
async function registerRoutes() {
  // Health check
  fastify.get('/health', async (request, reply) => {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: config.NODE_ENV
    }
  })

  // API routes
  await fastify.register(authRoutes, { prefix: '/api/auth' })
  await fastify.register(ideaRoutes, { prefix: '/api/ideas' })
  await fastify.register(nftRoutes, { prefix: '/api/nfts' })
  await fastify.register(daoRoutes, { prefix: '/api/dao' })
  await fastify.register(paymentRoutes, { prefix: '/api/payments' })
  await fastify.register(aiRoutes, { prefix: '/api/ai' })
  await fastify.register(ipfsRoutes, { prefix: '/api/ipfs' })
}

// Error handling
fastify.setErrorHandler(errorHandler)

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...')
  await fastify.close()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...')
  await fastify.close()
  process.exit(0)
})

// Start server
async function start() {
  try {
    await registerPlugins()
    await registerRoutes()
    
    const address = await fastify.listen({
      port: config.PORT,
      host: config.HOST,
    })
    
    logger.info(`🚀 Server running at ${address}`)
    logger.info(`📚 API Documentation available at ${address}/docs`)
  } catch (err) {
    logger.error('Error starting server:', err)
    process.exit(1)
  }
}

start()
