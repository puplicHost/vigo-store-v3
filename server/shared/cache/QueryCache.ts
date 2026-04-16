/**
 * Query Cache Utility
 * Caches Prisma query results to reduce database load
 */

import { getCacheProvider } from './CacheProvider'

export interface QueryCacheOptions {
  key: string
  ttl?: number
  forceRefresh?: boolean
}

/**
 * Cache a Prisma query result
 */
export async function cacheQuery<T>(
  options: QueryCacheOptions,
  queryFn: () => Promise<T>
): Promise<T> {
  const cache = getCacheProvider()

  // Try to get from cache
  if (!options.forceRefresh) {
    const cached = await cache.get<T>(options.key)
    if (cached !== null) {
      return cached
    }
  }

  // Execute query
  const result = await queryFn()

  // Cache result
  await cache.set(options.key, result, options.ttl)

  return result
}

/**
 * Cache a Prisma findMany query with automatic key generation
 */
export async function cacheFindMany<T>(
  model: string,
  where: Record<string, unknown> = {},
  orderBy: Record<string, unknown> = {},
  ttl: number = 300,
  forceRefresh: boolean = false,
  queryFn: () => Promise<T>
): Promise<T> {
  const key = `query:${model}:findMany:${JSON.stringify({ where, orderBy })}`
  
  return await cacheQuery({
    key,
    ttl,
    forceRefresh
  }, queryFn)
}

/**
 * Cache a Prisma findUnique query with automatic key generation
 */
export async function cacheFindUnique<T>(
  model: string,
  where: Record<string, unknown>,
  ttl: number = 3600,
  forceRefresh: boolean = false,
  queryFn: () => Promise<T>
): Promise<T> {
  const key = `query:${model}:findUnique:${JSON.stringify(where)}`
  
  return await cacheQuery({
    key,
    ttl,
    forceRefresh
  }, queryFn)
}

/**
 * Cache a Prisma count query with automatic key generation
 */
export async function cacheCount(
  model: string,
  where: Record<string, unknown> = {},
  ttl: number = 300,
  forceRefresh: boolean = false,
  queryFn: () => Promise<number>
): Promise<number> {
  const key = `query:${model}:count:${JSON.stringify(where)}`
  
  return await cacheQuery({
    key,
    ttl,
    forceRefresh
  }, queryFn)
}

/**
 * Invalidate cache for a specific model
 */
export async function invalidateModelCache(model: string): Promise<void> {
  const cache = getCacheProvider()
  await cache.delPattern(`query:${model}:*`)
}

/**
 * Invalidate cache for a specific query
 */
export async function invalidateQueryCache(key: string): Promise<void> {
  const cache = getCacheProvider()
  await cache.del(key)
}
