/**
 * Product Repository
 * Handles all database operations related to products
 */

import prisma from '../../../utils/prisma'
import type { ProductDTO, ProductListDTO, LowStockProductDTO } from '@shared/dto'

export class ProductRepository {
  /**
   * Find product by ID
   */
  async findById(id: string): Promise<ProductDTO | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })

    if (!product) return null

    return this.toProductDTO(product)
  }

  /**
   * Find product by slug
   */
  async findBySlug(slug: string): Promise<ProductDTO | null> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })

    if (!product) return null

    return this.toProductDTO(product)
  }

  /**
   * List products with pagination
   */
  async list(params: {
    page: number
    limit: number
    search?: string
    categoryId?: string
    isFeatured?: boolean
    showArchived?: boolean
  }): Promise<ProductListDTO> {
    const { page, limit, search, categoryId, isFeatured, showArchived } = params
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = showArchived
      ? { isDeleted: true }
      : {
          isDeleted: false,
          isActive: true
        }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ])

    return {
      products: products.map(product => this.toProductDTO(product)),
      total,
      page,
      limit
    }
  }

  /**
   * Get low stock products
   */
  async findLowStock(threshold: number = 10, limit: number = 10): Promise<LowStockProductDTO[]> {
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        stock: { lt: threshold }
      },
      take: limit,
      orderBy: { stock: 'asc' },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })

    return products.map(product => ({
      id: String(product.id),
      name: product.name,
      stock: product.stock,
      images: product.images,
      categoryId: String(product.categoryId),
      categoryName: product.category?.name
    }))
  }

  /**
   * Count products
   */
  async count(params?: { isDeleted?: boolean; isActive?: boolean }): Promise<number> {
    const where: Record<string, unknown> = {}

    if (params?.isDeleted !== undefined) {
      where.isDeleted = params.isDeleted
    }

    if (params?.isActive !== undefined) {
      where.isActive = params.isActive
    }

    return prisma.product.count({ where })
  }

  /**
   * Create product
   */
  async create(data: {
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
    const product = await prisma.product.create({
      data,
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })

    return this.toProductDTO(product)
  }

  /**
   * Update product
   */
  async update(id: string, data: Partial<{
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
    isActive: boolean
    categoryId: string
  }>): Promise<ProductDTO> {
    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })

    return this.toProductDTO(product)
  }

  /**
   * Soft delete product
   */
  async softDelete(id: string): Promise<ProductDTO> {
    const product = await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })

    return this.toProductDTO(product)
  }

  /**
   * Restore product
   */
  async restore(id: string): Promise<ProductDTO> {
    const product = await prisma.product.update({
      where: { id },
      data: { isDeleted: false },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })

    return this.toProductDTO(product)
  }

  /**
   * Convert Prisma product to DTO
   */
  private toProductDTO(product: any): ProductDTO {
    return {
      id: String(product.id),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      discount: product.discount ? Number(product.discount) : null,
      images: product.images,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock,
      isFeatured: product.isFeatured,
      isDeleted: product.isDeleted,
      isActive: product.isActive,
      categoryId: String(product.categoryId),
      categoryName: product.category?.name,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }
  }
}

// Singleton instance
export const productRepository = new ProductRepository()
