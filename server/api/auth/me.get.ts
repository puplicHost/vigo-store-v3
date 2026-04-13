import prisma from '../../utils/prisma'

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export default defineEventHandler(async (event) => {
  try {
    // Get user from auth middleware context
    const user = event.context.user

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Authentication required'
      })
    }

    // Fetch full user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    if (!dbUser) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    return { user: dbUser }
  } catch (error: any) {
    // If token is invalid, return 401
    if (error.statusCode === 401 || error.statusCode === 404) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch user'
    })
  }
})
