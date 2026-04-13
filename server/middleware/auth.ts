import jwt from 'jsonwebtoken'
import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const path = event.node.req.url || ''

  // Only check auth for /api/ routes (exclude auth endpoints)
  if (!path.startsWith('/api/') || path.startsWith('/api/auth/')) {
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
    // Token invalid - just don't attach user
    // Protected routes will handle 403 if needed
    return
  }
})
