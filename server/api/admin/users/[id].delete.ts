import prisma from '../../../utils/prisma'
import { requireSuperAdmin } from '../../../utils/admin'

/**
 * DELETE /api/admin/users/:id
 * Delete a user completely from the system (SUPER_ADMIN only)
 */
export default defineEventHandler(async (event) => {
  // Verify SUPER_ADMIN access
  requireSuperAdmin(event)

  try {
    // Get user ID from params
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Prevent SUPER_ADMIN from deleting themselves
    const currentUser = event.context.user
    if (id === currentUser.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cannot delete your own account'
      })
    }

    // Prevent deleting SUPER_ADMIN users (security)
    if (existingUser.role === 'SUPER_ADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cannot delete SUPER_ADMIN users'
      })
    }

    // Delete user (cascade will delete associated orders)
    await prisma.user.delete({
      where: { id }
    })

    return {
      success: true,
      message: 'User deleted successfully'
    }
  } catch (error: any) {
    // Pass through known errors
    if (error.statusCode === 400 || error.statusCode === 401 || error.statusCode === 403 || error.statusCode === 404) {
      throw error
    }

    console.error('[Delete User Error]:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete user'
    })
  }
})
