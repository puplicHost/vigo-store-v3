import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get category ID from route params
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      })
    }

    // Parse body
    const body = await readBody(event)
    const { name } = body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category name is required'
      })
    }

    const trimmedName = name.trim()

    // Check if new name conflicts with another category
    const existing = await prisma.category.findFirst({
      where: {
        name: trimmedName,
        NOT: { id }
      }
    })

    if (existing) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Another category with this name already exists'
      })
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: { name: trimmedName }
    })

    return {
      success: true,
      message: 'Category updated successfully',
      data: category
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }
    console.error('[Category PATCH Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update category'
    })
  }
})
