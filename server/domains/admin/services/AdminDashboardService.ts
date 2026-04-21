/**
 * Admin Dashboard Service
 * Aggregates data for the admin dashboard from multiple domains
 * With caching support for improved performance
 */

import prisma from '../../../utils/prisma'
import { getCacheProvider } from '../../../shared/cache/CacheProvider'
import type { AdminDashboardDTO, DashboardStatsDTO, RecentOrderDTO, LowStockProductDTO } from '@shared/dto'

// Cache keys
const CACHE_KEYS = {
  DASHBOARD_STATS: 'dashboard:stats',
  DASHBOARD_RECENT_ORDERS: 'dashboard:recent-orders',
  DASHBOARD_LOW_STOCK: 'dashboard:low-stock',
  DASHBOARD_COMPLETE: 'dashboard:complete'
}

// Cache TTL in seconds
const CACHE_TTL = {
  STATS: 300, // 5 minutes
  RECENT_ORDERS: 60, // 1 minute
  LOW_STOCK: 300, // 5 minutes
  COMPLETE: 60 // 1 minute
}

export class AdminDashboardService {
  private cache = getCacheProvider()

  /**
   * Get dashboard statistics (with caching)
   */
  async getStats(forceRefresh: boolean = false): Promise<DashboardStatsDTO> {
    const cacheKey = CACHE_KEYS.DASHBOARD_STATS

    // Try to get from cache
    if (!forceRefresh) {
      const cached = await this.cache.get<DashboardStatsDTO>(cacheKey)
      if (cached) {
        return cached
      }
    }

    // Fetch from database
    const [productsCount, categoriesCount, ordersCount, usersCount] = await Promise.all([
      prisma.product.count({ where: { isDeleted: false } }),
      prisma.category.count(),
      prisma.order.count(),
      prisma.user.count()
    ])

    const orders = await prisma.order.findMany({
      select: {
        totalAmount: true,
        status: true,
        paymentStatus: true
      }
    })

    const revenue = orders.reduce((sum, order) => sum + (order.paymentStatus === 'PAID' ? order.totalAmount : 0), 0)
    const paidOrders = orders.filter(o => o.paymentStatus === 'PAID').length
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length
    const averageOrderValue = orders.length > 0 ? revenue / orders.length : 0

    const users = await prisma.user.findMany({
      select: {
        role: true
      }
    })

    const adminUsers = users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length
    const customerUsers = users.filter(u => u.role === 'USER').length
    const staffUsers = users.filter(u => u.role === 'SALES' || u.role === 'MANAGER').length

    const stats: DashboardStatsDTO = {
      products: productsCount,
      categories: categoriesCount,
      orders: ordersCount,
      users: usersCount,
      revenue,
      paidOrders,
      pendingOrders,
      averageOrderValue,
      adminUsers,
      customerUsers,
      staffUsers
    }

    // Cache the result
    await this.cache.set(cacheKey, stats, CACHE_TTL.STATS)

    return stats
  }

  /**
   * Get recent orders for dashboard (with caching)
   */
  async getRecentOrders(limit: number = 5, forceRefresh: boolean = false): Promise<RecentOrderDTO[]> {
    const cacheKey = `${CACHE_KEYS.DASHBOARD_RECENT_ORDERS}:${limit}`

    // Try to get from cache
    if (!forceRefresh) {
      const cached = await this.cache.get<RecentOrderDTO[]>(cacheKey)
      if (cached) {
        return cached
      }
    }

    // Fetch from database
    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    const result = orders.map(order => {
      const idStr = String(order.id)
      return {
        id: idStr,
        displayId: idStr.slice(-8).toUpperCase(),
        totalAmount: Number(order.totalAmount),
        userName: order.user?.name || 'Guest',
        userInitial: order.user?.name?.charAt(0) || 'G',
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt.toISOString()
      }
    })

    // Cache the result
    await this.cache.set(cacheKey, result, CACHE_TTL.RECENT_ORDERS)

    return result
  }

  /**
   * Get low stock products for dashboard (with caching)
   */
  async getLowStockProducts(threshold: number = 10, limit: number = 10, forceRefresh: boolean = false): Promise<LowStockProductDTO[]> {
    const cacheKey = `${CACHE_KEYS.DASHBOARD_LOW_STOCK}:${threshold}:${limit}`

    // Try to get from cache
    if (!forceRefresh) {
      const cached = await this.cache.get<LowStockProductDTO[]>(cacheKey)
      if (cached) {
        return cached
      }
    }

    // Fetch from database
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        stock: { lt: threshold }
      },
      take: limit,
      orderBy: { stock: 'asc' },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })

    const result = products.map(product => ({
      id: String(product.id),
      name: product.name,
      stock: product.stock,
      images: product.images,
      categoryId: String(product.categoryId),
      categoryName: product.category?.name
    }))

    // Cache the result
    await this.cache.set(cacheKey, result, CACHE_TTL.LOW_STOCK)

    return result
  }

  /**
   * Get complete dashboard data (with caching)
   */
  async getDashboardData(forceRefresh: boolean = false): Promise<AdminDashboardDTO> {
    const cacheKey = CACHE_KEYS.DASHBOARD_COMPLETE

    // Try to get from cache
    if (!forceRefresh) {
      const cached = await this.cache.get<AdminDashboardDTO>(cacheKey)
      if (cached) {
        return cached
      }
    }

    // Fetch all data
    const [stats, recentOrders, lowStockProducts] = await Promise.all([
      this.getStats(forceRefresh),
      this.getRecentOrders(5, forceRefresh),
      this.getLowStockProducts(10, 10, forceRefresh)
    ])

    const result: AdminDashboardDTO = {
      stats,
      recentOrders,
      lowStockProducts
    }

    // Cache the complete result
    await this.cache.set(cacheKey, result, CACHE_TTL.COMPLETE)

    return result
  }

  /**
   * Invalidate dashboard cache
   * Call this when data changes that affects the dashboard
   */
  async invalidateCache(): Promise<void> {
    await Promise.all([
      this.cache.del(CACHE_KEYS.DASHBOARD_STATS),
      this.cache.delPattern(CACHE_KEYS.DASHBOARD_RECENT_ORDERS + ':*'),
      this.cache.delPattern(CACHE_KEYS.DASHBOARD_LOW_STOCK + ':*'),
      this.cache.del(CACHE_KEYS.DASHBOARD_COMPLETE)
    ])
  }

  /**
   * Invalidate specific cache keys
   */
  async invalidateStatsCache(): Promise<void> {
    await this.cache.del(CACHE_KEYS.DASHBOARD_STATS)
    await this.cache.del(CACHE_KEYS.DASHBOARD_COMPLETE)
  }

  async invalidateRecentOrdersCache(): Promise<void> {
    await this.cache.delPattern(CACHE_KEYS.DASHBOARD_RECENT_ORDERS + ':*')
    await this.cache.del(CACHE_KEYS.DASHBOARD_COMPLETE)
  }

  async invalidateLowStockCache(): Promise<void> {
    await this.cache.delPattern(CACHE_KEYS.DASHBOARD_LOW_STOCK + ':*')
    await this.cache.del(CACHE_KEYS.DASHBOARD_COMPLETE)
  }
}

// Singleton instance
export const adminDashboardService = new AdminDashboardService()
