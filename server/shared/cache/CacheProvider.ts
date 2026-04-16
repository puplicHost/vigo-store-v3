/**
 * Cache Provider Interface - Redis-ready abstraction
 * Allows switching between in-memory (dev) and Redis (prod) implementations
 */

export interface CacheProvider {
  /**
   * Get a value from cache
   */
  get<T>(key: string): Promise<T | null>

  /**
   * Set a value in cache with TTL (in seconds)
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>

  /**
   * Delete a key from cache
   */
  del(key: string): Promise<void>

  /**
   * Delete multiple keys matching a pattern
   */
  delPattern(pattern: string): Promise<void>

  /**
   * Check if a key exists
   */
  exists(key: string): Promise<boolean>
}

/**
 * In-memory cache provider (for development)
 */
export class InMemoryCacheProvider implements CacheProvider {
  private cache = new Map<string, { value: unknown; expiresAt?: number }>()

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key)
    if (!item) return null

    // Check if expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return item.value as T
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined
    this.cache.set(key, { value, expiresAt })
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async delPattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  async exists(key: string): Promise<boolean> {
    return this.cache.has(key)
  }
}

/**
 * Get the appropriate cache provider based on environment
 */
export function getCacheProvider(): CacheProvider {
  // In development, use in-memory cache
  // In production, this should return a Redis implementation
  if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
    // TODO: Implement RedisCacheProvider
    throw new Error('Redis cache provider not yet implemented')
  }

  return new InMemoryCacheProvider()
}
