import prisma from '../../../utils/prisma'
import { requireSuperAdmin } from '../../../utils/admin'
import bcrypt from 'bcrypt'

/**
 * POST /api/admin/users
 * Create a new admin/staff account (SUPER_ADMIN only)
 */
export default defineEventHandler(async (event) => {
  // Verify SUPER_ADMIN access
  requireSuperAdmin(event)

  try {
    // Read request body
    const body = await readBody(event)
    const { email, password, name, role } = body

    // Validation
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    if (!name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name is required'
      })
    }

    if (!role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Role is required'
      })
    }

    // Validate role is a valid enum value
    const validRoles = ['USER', 'SALES', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']
    if (!validRoles.includes(role)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email already exists'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true
      }
    })

    return {
      success: true,
      message: 'User created successfully',
      user: newUser
    }
  } catch (error: any) {
    // Pass through known errors
    if (error.statusCode === 400 || error.statusCode === 401 || error.statusCode === 403 || error.statusCode === 409) {
      throw error
    }

    console.error('[Create User Error]:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    })
  }
})
