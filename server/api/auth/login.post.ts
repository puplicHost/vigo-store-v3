import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { setCookie } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // 1. Validation - Missing fields
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }

  try {
    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // 3. Check if user exists
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // 4. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // 5. Sign JWT Token
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw createError({
        statusCode: 500,
        statusMessage: 'JWT_SECRET not configured'
      })
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      jwtSecret,
      { expiresIn: '7d' }
    )

    // 6. Set secure cookie (accessible from client-side for auth persistence)
    setCookie(event, 'auth_token', token, {
      httpOnly: false, // Allow client-side access
      secure: false, // Set to false for development
      sameSite: 'lax', // CSRF protection
      path: '/', // Available on all paths
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // 7. Return success with token and user info (token is also in httpOnly cookie)
    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }

  } catch (error: any) {
    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
