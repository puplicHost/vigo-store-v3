import prisma from '../../../utils/prisma'
import { requireAdmin, generateSlug } from '../../../utils/admin'
import { ProductSchema } from '../../../utils/validators'
import { productsService } from '../../../domains/catalog/services/ProductsService'
import { adminDashboardService } from '../../../domains/admin/services/AdminDashboardService'
import { logger } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Parse body
    const body = await readBody(event)

    // Validate with Zod
    const result = ProductSchema.safeParse(body)
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

    // Additional validation: discount must be between 0 and 100 if provided
    if (discount !== undefined && discount !== null && (discount < 0 || discount > 100)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Discount must be between 0 and 100'
      })
    }

    // Stock validation is already handled by Zod (non-negative)

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category not found'
      })
    }

    // Generate slug
    const baseSlug = generateSlug(name)
    let slug = baseSlug
    let counter = 1

    // Ensure slug is unique
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create product
    const product = await productsService.createProduct({
      name: name.trim(),
      slug,
      description: description || undefined,
      price: price,
      discount: discount || undefined,
      stock: stock,
      categoryId,
      images: images || [],
      sizes: sizes || [],
      colors: colors || [],
      isFeatured: isFeatured || false
    }, event.context.user?.userId || 'system', event.context.user?.role || 'ADMIN', event)

    // Invalidate dashboard cache
    await adminDashboardService.invalidateCache()

    return {
      success: true,
      message: 'Product created successfully',
      data: product
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    logger.error('[Product POST Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create product'
    })
  }
})
