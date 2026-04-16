/**
 * Rate Limiter - In-memory rate limiting for API endpoints
 * Prevents abuse and protects against brute force attacks
 */

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  skipSuccessfulRequests?: boolean
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
}

export class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>()

  /**
   * Check if request should be rate limited
   */
  check(identifier: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Get or create entry
    let entry = this.requests.get(identifier)

    // Reset if window expired
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs
      }
      this.requests.set(identifier, entry)
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }

    // Increment count
    entry.count++

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now()
    for (const [identifier, entry] of this.requests.entries()) {
      if (entry.resetTime < now) {
        this.requests.delete(identifier)
      }
    }
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier)
  }

  /**
   * Get all current rate limit entries
   */
  getEntries(): Map<string, { count: number; resetTime: number }> {
    return new Map(this.requests)
  }
}

// Predefined rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  // Auth endpoints - stricter limits
  AUTH: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
    skipSuccessfulRequests: false
  },
  
  // Admin endpoints - moderate limits
  ADMIN: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    skipSuccessfulRequests: true
  },
  
  // General API - higher limits
  API: {
    maxRequests: 1000,
    windowMs: 60 * 1000, // 1 minute
    skipSuccessfulRequests: true
  },
  
  // Sensitive operations (delete, update settings) - strict limits
  SENSITIVE: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
    skipSuccessfulRequests: false
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter()

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    rateLimiter.clearExpired()
  }, 5 * 60 * 1000)
}
