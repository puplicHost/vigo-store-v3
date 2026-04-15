import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { setCookie } from 'h3'
import prisma from '../../utils/prisma'
import { checkRateLimit, getRateLimitResetTime } from '../../utils/rateLimiter'
import { getRequestHeader } from 'h3'
import { LoginSchema } from '../../utils/validators'

export default defineEventHandler(async (event) => {
  // Rate limiting - max 5 attempts per IP per minute
  const ip = getRequestHeader(event, 'x-forwarded-for') || getRequestHeader(event, 'x-real-ip') || 'unknown'
  if (!checkRateLimit(ip, 5, 60000)) {
    const resetTime = getRateLimitResetTime(ip)
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many login attempts. Please try again later.',
      data: { resetTime }
    })
  }

  const body = await readBody(event)

  // Validate with Zod
  const result = LoginSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.issues[0]?.message || 'Validation failed'
    })
  }

  const { email, password } = result.data

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
      throw new Error('JWT_SECRET environment variable is not defined')
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

    // 6. Set secure cookie
    setCookie(event, 'auth_token', token, {
      httpOnly: true, // Prevents XSS token theft
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
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
