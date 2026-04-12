import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface DecodedToken {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

/**
 * Extract and verify JWT token from request
 */
export function extractToken(event: any): string | null {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) return null

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null

  return parts[1] || null
}

/**
 * Verify JWT token and return decoded payload
 */
export function verifyToken(token: string): DecodedToken {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token'
    })
  }
}

/**
 * Require authentication - throws 401 if no valid token
 */
export function requireAuth(event: any): DecodedToken {
  const token = extractToken(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  return verifyToken(token)
}
