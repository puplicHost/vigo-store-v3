import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export default defineEventHandler(async (event) => {
  try {
    // Verify JWT token and get user info
    const decoded = requireAuth(event)

    // Fetch full user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    return { user }
  } catch (error: any) {
    // If token is invalid, return 401
    if (error.statusCode === 401) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch user'
    })
  }
})
