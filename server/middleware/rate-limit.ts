/**
 * Rate Limit Middleware
 * Applies rate limiting to API endpoints based on configuration
 */

import { rateLimiter, RATE_LIMIT_CONFIGS, RateLimitResult } from '../shared/ratelimit/RateLimiter'
import { getRequestHeader } from 'h3'

export default defineEventHandler(async (event) => {
  // Skip rate limiting for non-API routes
  if (!event.node?.req?.url?.startsWith('/api/')) {
    return
  }

  // Get identifier (IP address)
  const identifier = getRequestHeader(event, 'x-forwarded-for') || 
                    getRequestHeader(event, 'x-real-ip') || 
                    event.node?.req?.socket?.remoteAddress ||
                    'unknown'

  // Determine rate limit config based on endpoint
  let config = RATE_LIMIT_CONFIGS.API
  const url = event.node?.req?.url || ''

  if (url.includes('/auth/login') || url.includes('/auth/register')) {
    config = RATE_LIMIT_CONFIGS.AUTH
  } else if (url.includes('/admin')) {
    config = RATE_LIMIT_CONFIGS.ADMIN
  } else if (url.includes('/delete') || url.includes('/settings')) {
    config = RATE_LIMIT_CONFIGS.SENSITIVE
  }

  // Check rate limit
  const result = rateLimiter.check(identifier, config)

  // Add rate limit headers
  setResponseHeader(event, 'X-RateLimit-Limit', result.limit.toString())
  setResponseHeader(event, 'X-RateLimit-Remaining', result.remaining.toString())
  setResponseHeader(event, 'X-RateLimit-Reset', new Date(result.resetTime).toISOString())

  // Block if limit exceeded
  if (!result.success) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      data: {
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
      }
    })
  }
})
