/**
 * GET /api/admin/dashboard
 * Returns aggregated dashboard data using AdminDashboardService
 */

import { requireAdmin } from '../../utils/admin'
import { adminDashboardService } from '../../domains/admin/services/AdminDashboardService'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    requireAdmin(event)

    // Get dashboard data using service
    const dashboardData = await adminDashboardService.getDashboardData()

    return {
      success: true,
      data: dashboardData
    }
  } catch (error: any) {
    // Pass through known errors
    if (error.statusCode === 401 || error.statusCode === 403) {
      throw error
    }

    console.error('[Dashboard Error]:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load dashboard data'
    })
  }
})
