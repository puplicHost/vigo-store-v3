/**
 * Catalog Service
 * Business logic for catalog management (categories, products)
 * With caching support for improved performance and audit logging
 */

import { categoryRepository } from '../repositories/CategoryRepository'
import { getCacheProvider } from '../../../shared/cache/CacheProvider'
import { auditLogService } from '../../../shared/audit/AuditLogService'
import { NotFoundError, ValidationError, ConflictError } from '@shared/errors/domain-errors'
import type { CategoryDTO } from '@shared/dto'

// Cache keys
const CACHE_KEYS = {
  CATEGORIES_ALL: 'categories:all',
  CATEGORY_BY_ID: (id: string) => `category:${id}`,
  CATEGORY_COUNT: 'categories:count'
}

// Cache TTL in seconds
const CACHE_TTL = {
  CATEGORIES_ALL: 600, // 10 minutes
  CATEGORY_BY_ID: 3600, // 1 hour
  CATEGORY_COUNT: 300 // 5 minutes
}

export class CatalogService {
  private cache = getCacheProvider()

  /**
   * Get all categories (with caching)
   */
  async getCategories(forceRefresh: boolean = false): Promise<CategoryDTO[]> {
    const cacheKey = CACHE_KEYS.CATEGORIES_ALL

    // Try to get from cache
    if (!forceRefresh) {
      const cached = await this.cache.get<CategoryDTO[]>(cacheKey)
      if (cached) {
        return cached
      }
    }

    // Fetch from database
    const categories = await categoryRepository.list()

    // Cache the result
    await this.cache.set(cacheKey, categories, CACHE_TTL.CATEGORIES_ALL)

    return categories
  }

  /**
   * Get category by ID (with caching)
   */
  async getCategoryById(id: string, forceRefresh: boolean = false): Promise<CategoryDTO> {
    const cacheKey = CACHE_KEYS.CATEGORY_BY_ID(id)

    // Try to get from cache
    if (!forceRefresh) {
      const cached = await this.cache.get<CategoryDTO>(cacheKey)
      if (cached) {
        return cached
      }
    }

    // Fetch from database
    const category = await categoryRepository.findById(id)
    
    if (!category) {
      throw new NotFoundError('Category', id)
    }

    // Cache the result
    await this.cache.set(cacheKey, category, CACHE_TTL.CATEGORY_BY_ID)

    return category
  }

  /**
   * Create category (invalidates cache + audit logging)
   */
  async createCategory(data: { name: string }, userId: string, userRole: string, event?: any): Promise<CategoryDTO> {
    // Validation
    if (!data.name || data.name.length < 2) {
      throw new ValidationError('Category name must be at least 2 characters')
    }

    // Check if category with same name already exists
    const existing = await categoryRepository.findByName(data.name)
    if (existing) {
      throw new ConflictError('Category with this name already exists')
    }

    // Create category
    const category = await categoryRepository.create(data)

    // Invalidate relevant caches
    await this.invalidateCategoriesCache()

    // Log audit
    await auditLogService.logCreate({
      userId,
      userRole,
      resource: 'category',
      resourceId: category.id,
      data,
      event
    })

    return category
  }

  /**
   * Update category (invalidates cache + audit logging)
   */
  async updateCategory(id: string, data: { name?: string }, userId: string, userRole: string, event?: any): Promise<CategoryDTO> {
    // Check if category exists
    const existing = await categoryRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Category', id)
    }

    // Validation
    if (data.name !== undefined) {
      if (data.name.length < 2) {
        throw new ValidationError('Category name must be at least 2 characters')
      }

      // Check if another category with same name exists
      const existingByName = await categoryRepository.findByName(data.name)
      if (existingByName && existingByName.id !== id) {
        throw new ConflictError('Category with this name already exists')
      }
    }

    // Calculate changes for audit
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (data.name !== undefined && data.name !== existing.name) {
      changes.name = { from: existing.name, to: data.name }
    }

    // Update category
    const category = await categoryRepository.update(id, data)

    // Invalidate relevant caches
    await this.invalidateCategoriesCache()
    await this.invalidateCategoryCache(id)

    // Log audit if there were changes
    if (Object.keys(changes).length > 0) {
      await auditLogService.logUpdate({
        userId,
        userRole,
        resource: 'category',
        resourceId: id,
        changes,
        event
      })
    }

    return category
  }

  /**
   * Delete category (invalidates cache + audit logging)
   */
  async deleteCategory(id: string, userId: string, userRole: string, event?: any): Promise<void> {
    // Check if category exists
    const existing = await categoryRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Category', id)
    }

    // Delete category
    await categoryRepository.delete(id)

    // Invalidate relevant caches
    await this.invalidateCategoriesCache()
    await this.invalidateCategoryCache(id)

    // Log audit
    await auditLogService.logDelete({
      userId,
      userRole,
      resource: 'category',
      resourceId: id,
      deletedData: existing as unknown as Record<string, unknown>,
      event
    })
  }

  /**
   * Count categories (with caching)
   */
  async countCategories(forceRefresh: boolean = false): Promise<number> {
    const cacheKey = CACHE_KEYS.CATEGORY_COUNT

    // Try to get from cache
    if (!forceRefresh) {
      const cached = await this.cache.get<number>(cacheKey)
      if (cached !== null) {
        return cached
      }
    }

    // Fetch from database
    const count = await categoryRepository.count()

    // Cache the result
    await this.cache.set(cacheKey, count, CACHE_TTL.CATEGORY_COUNT)

    return count
  }

  /**
   * Invalidate all category-related caches
   */
  async invalidateCategoriesCache(): Promise<void> {
    await Promise.all([
      this.cache.del(CACHE_KEYS.CATEGORIES_ALL),
      this.cache.del(CACHE_KEYS.CATEGORY_COUNT)
    ])
  }

  /**
   * Invalidate specific category cache
   */
  async invalidateCategoryCache(id: string): Promise<void> {
    await this.cache.del(CACHE_KEYS.CATEGORY_BY_ID(id))
  }
}

// Singleton instance
export const catalogService = new CatalogService()
