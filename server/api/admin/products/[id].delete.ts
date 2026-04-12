import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'

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
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: { take: 1 }
      }
    })

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // Check if product has order history
    if (product.orderItems.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete product with existing orders. Consider setting stock to 0 instead.'
      })
    }

    // Delete product
    await prisma.product.delete({
      where: { id }
    })

    return {
      success: true,
      message: 'Product deleted successfully'
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
    console.error('[Product DELETE Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete product'
    })
  }
})
