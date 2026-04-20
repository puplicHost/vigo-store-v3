import prisma from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin'
import { OrderStatus } from '@prisma/client'

/**
 * One-time maintenance task to fix corrupted OrderStatus enums
 * Migrates legacy statuses (SHIPPED, DELIVERED, PROCESSING, PAID) to CONFIRMED
 */
export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event)

    // Using raw query for maximum safety against enum drift in Prisma Client
    const result = await prisma.$executeRawUnsafe(`
      UPDATE "Order"
      SET "status" = 'CONFIRMED'
      WHERE "status" NOT IN ('PENDING', 'CONFIRMED', 'CANCELLED')
    `)

    return {
      success: true,
      affectedRows: result,
      message: `${result} orders migrated to the new standardized state machine.`
    }
  } catch (error: any) {
    console.error('[MAINTENANCE ERROR]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Migration failed. Ensure the OrderStatus enum in DB matches the schema.'
    })
  }
})
