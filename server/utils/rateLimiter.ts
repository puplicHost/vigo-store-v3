/**
 * Simple in-memory rate limiter
 * Max 5 attempts per IP per minute
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(ip: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  // Clean up expired entries
  if (record && now > record.resetTime) {
    rateLimitMap.delete(ip)
    return true
  }

  // Check if IP exists and is within limit
  if (record) {
    if (record.count >= maxAttempts) {
      return false // Rate limit exceeded
    }
    record.count++
    return true
  }

  // Create new record
  rateLimitMap.set(ip, {
    count: 1,
    resetTime: now + windowMs
  })

  return true
}

export function getRateLimitResetTime(ip: string): number | null {
  const record = rateLimitMap.get(ip)
  return record ? record.resetTime : null
}
