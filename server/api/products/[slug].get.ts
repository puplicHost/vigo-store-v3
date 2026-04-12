import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        message: 'Product slug is required'
      })
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found'
      })
    }

    return product
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw error
    }
    console.error('[Product Detail Error]', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch product'
    })
  }
})
