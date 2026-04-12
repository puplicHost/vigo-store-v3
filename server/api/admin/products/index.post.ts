import prisma from '../../../utils/prisma'
import { requireAdmin, generateSlug } from '../../../utils/admin'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Parse body
    const body = await readBody(event)
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
    } = body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product name is required'
      })
    }

    if (price === undefined || price === null || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid product price is required'
      })
    }

    if (!categoryId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      })
    }

    if (stock === undefined || stock === null || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid stock quantity is required'
      })
    }

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
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description: description || null,
        price: parseFloat(price),
        discount: discount ? parseFloat(discount) : null,
        stock: parseInt(stock),
        categoryId,
        images: images || [],
        sizes: sizes || [],
        colors: colors || [],
        isFeatured: isFeatured || false
      },
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
      message: 'Product created successfully',
      data: product
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('[Product POST Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create product'
    })
  }
})
