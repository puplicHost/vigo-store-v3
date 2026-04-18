import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'
import { logger } from '../../../utils/logger'
import { adminDashboardService } from '../../../domains/admin/services/AdminDashboardService'
import { productsService } from '../../../domains/catalog/services/ProductsService'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get product ID and query params
    const id = getRouterParam(event, 'id')
    const query = getQuery(event)
    const permanent = query.permanent === 'true'

    console.log('Deleting product in API:', id, 'permanent:', permanent)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      })
    }

    if (permanent) {
      // Idempotent hard delete: duplicate requests should not fail with 404
      const result = await prisma.product.deleteMany({
        where: { id }
      })
      const alreadyDeleted = result.count === 0
      logger.audit(event.context.user.userId, 'PERMANENT_DELETE_PRODUCT', id, {
        alreadyDeleted
      })
      await adminDashboardService.invalidateCache()
      await productsService.invalidateProductsCache()
      await productsService.invalidateProductCache(id)
      return {
        success: true,
        message: alreadyDeleted ? 'Product already deleted' : 'Product permanently deleted',
        alreadyDeleted
      }
    } else {
      // Check if product exists before archive
      const product = await prisma.product.findFirst({
        where: { id },
        include: {
          _count: true
        }
      })

      if (!product) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Product not found'
        })
      }

      // Soft delete (archive) the product
      await prisma.product.update({
        where: { id },
        data: {
          isDeleted: true,
          isActive: false,
          deletedAt: new Date()
        }
      })
      console.log('Product archived:', id)
      logger.audit(event.context.user.userId, 'ARCHIVE_PRODUCT', id)
      await adminDashboardService.invalidateCache()
      await productsService.invalidateProductsCache()
      await productsService.invalidateProductCache(id)
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
