import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const path = event.node.req.url || ''

  // Only check auth for /api/ routes (exclude auth endpoints)
  if (!path.startsWith('/api/') || path.startsWith('/api/auth/')) {
    return
  }

  // Get Authorization header
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return
  }

  // Extract token
  const token = authHeader.substring(7)

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
