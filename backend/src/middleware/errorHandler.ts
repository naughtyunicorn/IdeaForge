import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { logger } from '@/utils/logger'
import { APIResponse } from '@/types'

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  logger.error('API Error:', {
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    statusCode: error.statusCode || 500
  })

  const response: APIResponse = {
    success: false,
    error: error.message || 'Internal Server Error',
    timestamp: Date.now()
  }

  // Handle specific error types
  if (error.statusCode) {
    reply.code(error.statusCode)
  } else if (error.name === 'ValidationError') {
    reply.code(400)
    response.error = 'Validation Error'
  } else if (error.name === 'UnauthorizedError') {
    reply.code(401)
    response.error = 'Unauthorized'
  } else if (error.name === 'ForbiddenError') {
    reply.code(403)
    response.error = 'Forbidden'
  } else if (error.name === 'NotFoundError') {
    reply.code(404)
    response.error = 'Not Found'
  } else {
    reply.code(500)
    response.error = 'Internal Server Error'
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && reply.statusCode >= 500) {
    response.error = 'Internal Server Error'
  }

  return reply.send(response)
}
