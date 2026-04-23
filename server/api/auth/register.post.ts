import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { setCookie } from 'h3'
import { checkRateLimit, getRateLimitResetTime } from '../../utils/rateLimiter'
import { getRequestHeader } from 'h3'
import { RegisterSchema } from '../../utils/validators'

export default defineEventHandler(async (event) => {
  // Rate limiting - max 5 attempts per IP per minute
  const ip = getRequestHeader(event, 'x-forwarded-for') || getRequestHeader(event, 'x-real-ip') || 'unknown'
  if (!checkRateLimit(ip, 5, 60000)) {
    const resetTime = getRateLimitResetTime(ip)
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many registration attempts. Please try again later.',
      data: { resetTime }
    })
  }

  const body = await readBody(event)

  // Validate with Zod
  const result = RegisterSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.issues[0]?.message || 'Validation failed'
    })
  }

  const { email, password, name } = result.data

  try {
    // نستخدم prisma مباشرة (Auto-imported)
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email already registered'
      })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: 'USER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    // Sign JWT Token
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

    // Set secure cookie
    setCookie(event, 'auth_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return {
      success: true,
      message: 'User registered successfully',
      token,
      user
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})