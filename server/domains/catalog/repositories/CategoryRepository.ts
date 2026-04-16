/**
 * Category Repository
 * Handles all database operations related to categories
 */

import prisma from '../../../utils/prisma'
import type { CategoryDTO } from '../../../../shared/dto'

export class CategoryRepository {
  /**
   * Find category by ID
   */
  async findById(id: string): Promise<CategoryDTO | null> {
    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) return null

    return this.toCategoryDTO(category)
  }

  /**
   * Find category by name
   */
  async findByName(name: string): Promise<CategoryDTO | null> {
    const category = await prisma.category.findUnique({
      where: { name }
    })

    if (!category) return null

    return this.toCategoryDTO(category)
  }

  /**
   * List all categories
   */
  async list(): Promise<CategoryDTO[]> {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })

    return categories.map(category => this.toCategoryDTO(category))
  }

  /**
   * Create category
   */
  async create(data: { name: string }): Promise<CategoryDTO> {
    const category = await prisma.category.create({
      data
    })

    return this.toCategoryDTO(category)
  }

  /**
   * Update category
   */
  async update(id: string, data: { name?: string }): Promise<CategoryDTO> {
    const category = await prisma.category.update({
      where: { id },
      data
    })

    return this.toCategoryDTO(category)
  }

  /**
   * Delete category
   */
  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id }
    })
  }

  /**
   * Count categories
   */
  async count(): Promise<number> {
    return prisma.category.count()
  }

  /**
   * Convert Prisma category to DTO
   */
  private toCategoryDTO(category: any): CategoryDTO {
    return {
      id: String(category.id),
      name: category.name,
      createdAt: (category.createdAt instanceof Date ? category.createdAt : new Date()).toISOString(),
      updatedAt: (category.updatedAt instanceof Date ? category.updatedAt : new Date()).toISOString()
    }
  }
}

// Singleton instance
export const categoryRepository = new CategoryRepository()
