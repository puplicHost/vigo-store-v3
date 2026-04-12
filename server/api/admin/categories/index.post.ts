import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

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

    // Check if category already exists
    const existing = await prisma.category.findUnique({
      where: { name: trimmedName }
    })

    if (existing) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category with this name already exists'
      })
    }

    // Create category
    const category = await prisma.category.create({
      data: { name: trimmedName }
    })

    return {
      success: true,
      message: 'Category created successfully',
      data: category
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('[Category POST Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create category'
    })
  }
})
