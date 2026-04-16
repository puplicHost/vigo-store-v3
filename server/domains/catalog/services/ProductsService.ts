/**
 * Products Service
 * Business logic for product management
 */

import { productRepository } from '../repositories/ProductRepository'
import { NotFoundError, ValidationError } from '../../../../shared/errors/domain-errors'
import type { ProductDTO, ProductListDTO } from '../../../../shared/dto'

export class ProductsService {
  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<ProductDTO> {
    const product = await productRepository.findById(id)
    
    if (!product) {
      throw new NotFoundError('Product', id)
    }

    return product
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string): Promise<ProductDTO> {
    const product = await productRepository.findBySlug(slug)
    
    if (!product) {
      throw new NotFoundError('Product', slug)
    }

    return product
  }

  /**
   * List products with pagination
   */
  async listProducts(params: {
    page: number
    limit: number
    search?: string
    categoryId?: string
    isFeatured?: boolean
  }): Promise<ProductListDTO> {
    return await productRepository.list(params)
  }

  /**
   * Create product
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
  }): Promise<ProductDTO> {
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
    return await productRepository.create(data)
  }

  /**
   * Update product
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
  }>): Promise<ProductDTO> {
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

    // Update product using repository
    return await productRepository.update(id, data)
  }

  /**
   * Delete product (soft delete)
   */
  async deleteProduct(id: string): Promise<void> {
    const existing = await productRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Product', id)
    }

    // Soft delete using repository
    await productRepository.softDelete(id)
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(threshold: number = 10, limit: number = 10) {
    return await productRepository.findLowStock(threshold, limit)
  }

  /**
   * Count products
   */
  async countProducts(params?: { isDeleted?: boolean; isActive?: boolean }): Promise<number> {
    return await productRepository.count(params)
  }
}

// Singleton instance
export const productsService = new ProductsService()
