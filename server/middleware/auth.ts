import jwt from 'jsonwebtoken'
import { getCookie, deleteCookie } from 'h3'
import { logger } from '../utils/logger'

export default defineEventHandler(async (event) => {
  const path = event.node.req.url || ''

  // Always initialize user context to null to prevent "undefined" issues
  event.context.user = null

  // Skip auth logic for public routes (optional optimization)
  if (!path.startsWith('/api/') ||
      path.startsWith('/api/auth/login') ||
      path.startsWith('/api/auth/register')) {
    return
  }

  // Validate JWT_SECRET
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    logger.error('CRITICAL: JWT_SECRET environment variable is missing')
    return
  }

  try {
    // Try to get token from Authorization header or Cookie
    const authHeader = getHeader(event, 'authorization')
    let token: string | null = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      token = getCookie(event, 'auth_token') || null
    }

    if (!token) {
      return
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string
      email: string
      role: string
    }

    // Attach user to context
    event.context.user = decoded

  } catch (error) {
    // Token is expired or invalid
    event.context.user = null
    
    // Clear cookie if present to prevent repeating invalid requests
    if (getCookie(event, 'auth_token')) {
      deleteCookie(event, 'auth_token', {
        path: '/',
        sameSite: 'lax'
      })
    }
  }
})
