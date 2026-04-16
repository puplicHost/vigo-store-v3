/**
 * Catalog Service
 * Business logic for catalog management (categories, products)
 */

import { categoryRepository } from '../repositories/CategoryRepository'
import { NotFoundError, ValidationError, ConflictError } from '../../../../shared/errors/domain-errors'
import type { CategoryDTO } from '../../../../shared/dto'

export class CatalogService {
  /**
   * Get all categories
   */
  async getCategories(): Promise<CategoryDTO[]> {
    return await categoryRepository.list()
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<CategoryDTO> {
    const category = await categoryRepository.findById(id)
    
    if (!category) {
      throw new NotFoundError('Category', id)
    }

    return category
  }

  /**
   * Create category
   */
  async createCategory(data: { name: string }): Promise<CategoryDTO> {
    // Validation
    if (!data.name || data.name.length < 2) {
      throw new ValidationError('Category name must be at least 2 characters')
    }

    // Check if category with same name already exists
    const existing = await categoryRepository.findByName(data.name)
    if (existing) {
      throw new ConflictError('Category with this name already exists')
    }

    return await categoryRepository.create(data)
  }

  /**
   * Update category
   */
  async updateCategory(id: string, data: { name?: string }): Promise<CategoryDTO> {
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

    return await categoryRepository.update(id, data)
  }

  /**
   * Delete category
   */
  async deleteCategory(id: string): Promise<void> {
    // Check if category exists
    const existing = await categoryRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Category', id)
    }

    await categoryRepository.delete(id)
  }

  /**
   * Count categories
   */
  async countCategories(): Promise<number> {
    return await categoryRepository.count()
  }
}

// Singleton instance
export const catalogService = new CatalogService()
