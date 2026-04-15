import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'
import { logger } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get product ID and query params
    const id = getRouterParam(event, 'id')
    const query = getQuery(event)
    const permanent = query.permanent === 'true'

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    if (permanent) {
      // Hard delete from database
      await prisma.product.delete({
        where: { id }
      })
      logger.audit(event.context.user.userId, 'PERMANENT_DELETE_PRODUCT', id)
      return {
        success: true,
        message: 'Product permanently deleted'
      }
    } else {
      // Soft delete (archive) the product
      await prisma.product.update({
        where: { id },
        data: {
          isDeleted: true,
          isActive: false,
          deletedAt: new Date()
        }
      })
      logger.audit(event.context.user.userId, 'ARCHIVE_PRODUCT', id)
      return {
        success: true,
        message: 'Product archived successfully'
      }
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
      statusMessage: 'Failed to archive product'
    })
  }
})
