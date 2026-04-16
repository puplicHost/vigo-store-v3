/**
 * Products Service
 * Business logic for product management
 * With caching support for improved performance and audit logging
 */

import { productRepository } from '../repositories/ProductRepository'
import { getCacheProvider } from '../../../shared/cache/CacheProvider'
import { auditLogService } from '../../../shared/audit/AuditLogService'
import { NotFoundError, ValidationError } from '../../../../shared/errors/domain-errors'
import type { ProductDTO, ProductListDTO } from '../../../../shared/dto'

// Cache keys
const CACHE_KEYS = {
  PRODUCT_BY_ID: (id: string) => `product:${id}`,
  PRODUCT_BY_SLUG: (slug: string) => `product:slug:${slug}`,
  PRODUCTS_LIST: (params: string) => `products:list:${params}`,
  PRODUCT_COUNT: (params: string) => `products:count:${params}`,
  LOW_STOCK: (threshold: number, limit: number) => `products:low-stock:${threshold}:${limit}`
}

// Cache TTL in seconds
const CACHE_TTL = {
  PRODUCT_BY_ID: 3600, // 1 hour
  PRODUCT_BY_SLUG: 3600, // 1 hour
  PRODUCTS_LIST: 300, // 5 minutes
  PRODUCT_COUNT: 300, // 5 minutes
  LOW_STOCK: 300 // 5 minutes
}

export class ProductsService {
  private cache = getCacheProvider()

  /**
   * Get product by ID (with caching)
   */
  async getProductById(id: string, forceRefresh: boolean = false): Promise<ProductDTO> {
    const cacheKey = CACHE_KEYS.PRODUCT_BY_ID(id)

    // Try to get from cache
    if (!forceRefresh) {
      const cached = await this.cache.get<ProductDTO>(cacheKey)
      if (cached) {
        return cached
      }
    }

    // Fetch from database
    const product = await productRepository.findById(id)
    
    if (!product) {
      throw new NotFoundError('Product', id)
    }

    // Cache the result
    await this.cache.set(cacheKey, product, CACHE_TTL.PRODUCT_BY_ID)

    return product
  }

  /**
   * Get product by slug (with caching)
   */
  async getProductBySlug(slug: string, forceRefresh: boolean = false): Promise<ProductDTO> {
    const cacheKey = CACHE_KEYS.PRODUCT_BY_SLUG(slug)

    // Try to get from cache
    if (!forceRefresh) {
      const cached = await this.cache.get<ProductDTO>(cacheKey)
      if (cached) {
        return cached
      }
    }

    // Fetch from database
    const product = await productRepository.findBySlug(slug)
    
    if (!product) {
      throw new NotFoundError('Product', slug)
    }

    // Cache the result
    await this.cache.set(cacheKey, product, CACHE_TTL.PRODUCT_BY_SLUG)

    return product
  }

  /**
   * List products with pagination (with caching)
   */
  async listProducts(params: {
    page: number
    limit: number
    search?: string
    categoryId?: string
    isFeatured?: boolean
  }, forceRefresh: boolean = false): Promise<ProductListDTO> {
    const cacheKey = CACHE_KEYS.PRODUCTS_LIST(JSON.stringify(params))

    // Try to get from cache
    if (!forceRefresh) {
      const cached = await this.cache.get<ProductListDTO>(cacheKey)
      if (cached) {
        return cached
      }
    }

    // Fetch from database
    const result = await productRepository.list(params)

    // Cache the result
    await this.cache.set(cacheKey, result, CACHE_TTL.PRODUCTS_LIST)

    return result
  }

  /**
   * Create product (invalidates cache + audit logging)
   */
  async createProduct(data: {
    name: string
    slug: string
    description?: string
    price: number
    discount?: number
    images: string[]
    sizes?: string[]
    colors?: string[]
    stock: number
    isFeatured?: boolean
    categoryId: string
  }, userId: string, userRole: string, event?: any): Promise<ProductDTO> {
    // Validation
    if (!data.name || data.name.length < 2) {
      throw new ValidationError('Product name must be at least 2 characters')
    }

    if (!data.slug || data.slug.length < 2) {
      throw new ValidationError('Product slug must be at least 2 characters')
    }

    if (data.price <= 0) {
      throw new ValidationError('Product price must be positive')
    }

    if (!data.images || data.images.length === 0) {
      throw new ValidationError('Product must have at least one image')
    }

    if (data.stock < 0) {
      throw new ValidationError('Product stock cannot be negative')
    }

    // Create product using repository
    const product = await productRepository.create(data)

    // Invalidate relevant caches
    await this.invalidateProductsCache()

    // Log audit
    await auditLogService.logCreate({
      userId,
      userRole,
      resource: 'product',
      resourceId: product.id,
      data,
      event
    })

    return product
  }

  /**
   * Update product (invalidates cache + audit logging)
   */
  async updateProduct(id: string, data: Partial<{
    name: string
    slug: string
    description: string
    price: number
    discount: number
    images: string[]
    sizes: string[]
    colors: string[]
    stock: number
    isFeatured: boolean
    categoryId: string
  }>, userId: string, userRole: string, event?: any): Promise<ProductDTO> {
    // Check if product exists
    const existing = await productRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Product', id)
    }

    // Validation
    if (data.price !== undefined && data.price <= 0) {
      throw new ValidationError('Product price must be positive')
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new ValidationError('Product stock cannot be negative')
    }

    // Calculate changes for audit
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== (existing as any)[key]) {
        changes[key] = { from: (existing as any)[key], to: value }
      }
    })

    // Update product using repository
    const product = await productRepository.update(id, data)

    // Invalidate relevant caches
    await this.invalidateProductsCache()
    await this.invalidateProductCache(id)

    // Log audit if there were changes
    if (Object.keys(changes).length > 0) {
      await auditLogService.logUpdate({
        userId,
        userRole,
        resource: 'product',
        resourceId: id,
        changes,
        event
      })
    }

    return product
  }

  /**
   * Delete product (soft delete, invalidates cache + audit logging)
   */
  async deleteProduct(id: string, userId: string, userRole: string, event?: any): Promise<void> {
    const existing = await productRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Product', id)
    }

    // Soft delete using repository
    await productRepository.softDelete(id)

    // Invalidate relevant caches
    await this.invalidateProductsCache()
    await this.invalidateProductCache(id)

    // Log audit
    await auditLogService.logDelete({
      userId,
      userRole,
      resource: 'product',
      resourceId: id,
      deletedData: existing as unknown as Record<string, unknown>,
      event
    })
  }

  /**
   * Get low stock products (with caching)
   */
  async getLowStockProducts(threshold: number = 10, limit: number = 10, forceRefresh: boolean = false) {
    const cacheKey = CACHE_KEYS.LOW_STOCK(threshold, limit)

    // Try to get from cache
    if (!forceRefresh) {
      const cached = await this.cache.get(cacheKey)
      if (cached) {
        return cached
      }
    }

    const result = await productRepository.findLowStock(threshold, limit)

    // Cache the result
    await this.cache.set(cacheKey, result, CACHE_TTL.LOW_STOCK)

    return result
  }

  /**
   * Count products (with caching)
   */
  async countProducts(params?: { isDeleted?: boolean; isActive?: boolean }, forceRefresh: boolean = false): Promise<number> {
    const cacheKey = CACHE_KEYS.PRODUCT_COUNT(JSON.stringify(params || {}))

    // Try to get from cache
    if (!forceRefresh) {
      const cached = await this.cache.get<number>(cacheKey)
      if (cached !== null) {
        return cached
      }
    }

    const count = await productRepository.count(params)

    // Cache the result
    await this.cache.set(cacheKey, count, CACHE_TTL.PRODUCT_COUNT)

    return count
  }

  /**
   * Invalidate all product-related caches
   */
  async invalidateProductsCache(): Promise<void> {
    await this.cache.delPattern('products:*')
  }

  /**
   * Invalidate specific product cache
   */
  async invalidateProductCache(id: string): Promise<void> {
    await Promise.all([
      this.cache.delPattern(`product:${id}`),
      this.cache.delPattern(`product:slug:*`)
    ])
  }
}

// Singleton instance
export const productsService = new ProductsService()
