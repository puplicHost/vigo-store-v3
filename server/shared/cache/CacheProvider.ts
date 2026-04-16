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
 * Redis cache provider (for production)
 * Uses ioredis for Redis connection
 */
export class RedisCacheProvider implements CacheProvider {
  private client: any = null

  constructor() {
    // Lazy load Redis client to avoid issues if Redis is not configured
    this.initialize()
  }

  private async initialize() {
    try {
      // Dynamic import to avoid requiring Redis in dev
      const Redis = (await import('ioredis')).default
      this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => Math.min(times * 50, 2000),
        enableReadyCheck: true
      })

      this.client.on('error', (err: Error) => {
        console.error('[Redis Error]:', err)
      })

      this.client.on('connect', () => {
        console.log('[Redis] Connected successfully')
      })
    } catch (error) {
      console.error('[Redis] Failed to initialize:', error)
    }
  }

  private ensureConnected() {
    if (!this.client) {
      throw new Error('Redis client not initialized')
    }
  }

  async get<T>(key: string): Promise<T | null> {
    this.ensureConnected()

    try {
      const value = await this.client.get(key)
      if (!value) return null

      return JSON.parse(value) as T
    } catch (error) {
      console.error('[Redis Get Error]:', error)
      return null
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.ensureConnected()

    try {
      const serialized = JSON.stringify(value)
      if (ttlSeconds) {
        await this.client.setex(key, ttlSeconds, serialized)
      } else {
        await this.client.set(key, serialized)
      }
    } catch (error) {
      console.error('[Redis Set Error]:', error)
    }
  }

  async del(key: string): Promise<void> {
    this.ensureConnected()

    try {
      await this.client.del(key)
    } catch (error) {
      console.error('[Redis Delete Error]:', error)
    }
  }

  async delPattern(pattern: string): Promise<void> {
    this.ensureConnected()

    try {
      const keys = await this.client.keys(pattern)
      if (keys.length > 0) {
        await this.client.del(...keys)
      }
    } catch (error) {
      console.error('[Redis Delete Pattern Error]:', error)
    }
  }

  async exists(key: string): Promise<boolean> {
    this.ensureConnected()

    try {
      return (await this.client.exists(key)) === 1
    } catch (error) {
      console.error('[Redis Exists Error]:', error)
      return false
    }
  }

  /**
   * Close Redis connection
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit()
    }
  }
}

/**
 * Get the appropriate cache provider based on environment
 */
export function getCacheProvider(): CacheProvider {
  // In development, use in-memory cache
  // In production with REDIS_URL, use Redis
  if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
    return new RedisCacheProvider()
  }

  return new InMemoryCacheProvider()
}
