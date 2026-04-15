import prisma from '../../../utils/prisma'
import { requireAdmin, generateSlug } from '../../../utils/admin'
import { UpdateProductSchema } from '../../../utils/validators'
import { logger } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get product ID from route params
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      })
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // Parse body
    const body = await readBody(event)

    // Validate with Zod
    const result = UpdateProductSchema.safeParse(body)
    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: result.error.issues[0]?.message || 'Validation failed'
      })
    }

    const {
      name,
      description,
      price,
      discount,
      stock,
      categoryId,
      images,
      sizes,
      colors,
      isFeatured
    } = result.data

    // Build update data
    const updateData: any = {}

    if (name !== undefined) {
      updateData.name = name.trim()

      // Regenerate slug if name changed
      if (name.trim() !== existingProduct.name) {
        const baseSlug = generateSlug(name)
        let slug = baseSlug
        let counter = 1

        // Ensure slug is unique (exclude current product)
        while (await prisma.product.findFirst({
          where: { slug, NOT: { id } }
        })) {
          slug = `${baseSlug}-${counter}`
          counter++
        }

        updateData.slug = slug
      }
    }

    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = price
    if (discount !== undefined) updateData.discount = discount || null
    if (stock !== undefined) updateData.stock = stock
    if (images !== undefined) updateData.images = images
    if (sizes !== undefined) updateData.sizes = sizes
    if (colors !== undefined) updateData.colors = colors
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured

    // Validate and update category if provided
    if (categoryId !== undefined) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      })
      if (!category) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Category not found'
        })
      }
      updateData.categoryId = categoryId
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return {
      success: true,
      message: 'Product updated successfully',
      data: product
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }
    logger.error('[Product PATCH Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update product'
    })
  }
})
