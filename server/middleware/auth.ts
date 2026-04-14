import jwt from 'jsonwebtoken'
import { getCookie, setCookie, deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const path = event.node.req.url || ''

  // Skip auth for public routes
  if (!path.startsWith('/api/') ||
      path.startsWith('/api/auth/login') ||
      path.startsWith('/api/auth/register') ||
      path.startsWith('/api/auth/me')) {
    return
  }

  // Try to get token from Authorization header first
  const authHeader = getHeader(event, 'authorization')
  let token: string | null = null

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  } else {
    // Try to get token from cookie
    const cookieToken = getCookie(event, 'auth_token')
    token = cookieToken || null
  }

  if (!token) {
    return
  }

  try {
    // Verify token
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured')
      return
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string
      email: string
      role: string
    }

    // Attach user to context
    event.context.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    }

  } catch (error) {
    // Token is expired or invalid - clear cookie and set user to null
    // This prevents server crashes and ensures clean state
    event.context.user = null
    deleteCookie(event, 'auth_token', {
      path: '/',
      sameSite: 'lax'
    })
    return
  }
})
