import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Fetch all products with their category
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return products
  } catch (error: any) {
    console.error('[Products GET Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    })
  }
})
