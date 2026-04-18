import prisma from '../../../utils/prisma'
import { requireSuperAdmin } from '../../../utils/admin'
import bcrypt from 'bcrypt'

/**
 * PATCH /api/admin/users/:id
 * Update user data (name, email, role) - SUPER_ADMIN only
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

    // Read request body
    const body = await readBody(event)
    const { name, email, role, password } = body

    // Validate at least one field is provided
    if (!name && !email && !role && !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one field must be provided for update'
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

    // Prevent SUPER_ADMIN from modifying their own role (security)
    const currentUser = event.context.user
    if (id === currentUser.id && role && role !== 'SUPER_ADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cannot change your own SUPER_ADMIN role'
      })
    }

    // Prevent changing SUPER_ADMIN role to another role (security)
    if (existingUser.role === 'SUPER_ADMIN' && role && role !== 'SUPER_ADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cannot change SUPER_ADMIN role to another role'
      })
    }

    // Build update data
    const updateData: any = {}

    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role) {
      const validRoles = ['USER', 'SALES', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']
      if (!validRoles.includes(role)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid role. Must be one of: ${validRoles.join(', ')}`
        })
      }
      updateData.role = role
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Invalidate dashboard cache
    const { adminDashboardService } = await import('../../../domains/admin/services/AdminDashboardService')
    await adminDashboardService.invalidateCache()

    return {
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    }
  } catch (error: any) {
    // Pass through known errors
    if (error.statusCode === 400 || error.statusCode === 401 || error.statusCode === 403 || error.statusCode === 404) {
      throw error
    }

    console.error('[Update User Error]:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update user'
    })
  }
})
