import { defineEventHandler, getCookie, setCookie, getHeader, createError } from 'h3'
import { randomBytes } from 'crypto'

export default defineEventHandler((event) => {
  // Only apply to API routes
  if (!event.path.startsWith('/api/')) {
    return
  }

  // Get existing CSRF token from cookie
  let csrfToken = getCookie(event, 'csrf_token')

  // If no token, generate a new one and set cookie
  if (!csrfToken) {
    csrfToken = randomBytes(32).toString('hex')
    setCookie(event, 'csrf_token', csrfToken, {
      httpOnly: false, // Must be accessible by client to send back in header
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })
  }

  // Verify token for state-changing requests
  const method = event.method.toUpperCase()
  if (['POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) {
    const headerToken = getHeader(event, 'x-csrf-token')
    
    if (!headerToken || headerToken !== csrfToken) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid or missing CSRF token'
      })
    }
  }
})
