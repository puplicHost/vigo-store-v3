/**
 * Admin Dashboard Service
 * Aggregates data for the admin dashboard from multiple domains
 */

import prisma from '../../../utils/prisma'
import type { AdminDashboardDTO, DashboardStatsDTO, RecentOrderDTO, LowStockProductDTO } from '../../../../shared/dto'

export class AdminDashboardService {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStatsDTO> {
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

    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const paidOrders = orders.filter(o => o.paymentStatus === 'PAID').length
    const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PAID').length
    const averageOrderValue = orders.length > 0 ? revenue / orders.length : 0

    const users = await prisma.user.findMany({
      select: {
        role: true
      }
    })

    const adminUsers = users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length
    const customerUsers = users.filter(u => u.role === 'USER').length
    const staffUsers = users.filter(u => u.role === 'SALES' || u.role === 'MANAGER').length

    return {
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
  }

  /**
   * Get recent orders for dashboard
   */
  async getRecentOrders(limit: number = 5): Promise<RecentOrderDTO[]> {
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

    return orders.map(order => {
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
  }

  /**
   * Get low stock products for dashboard
   */
  async getLowStockProducts(threshold: number = 10, limit: number = 10): Promise<LowStockProductDTO[]> {
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

    return products.map(product => ({
      id: String(product.id),
      name: product.name,
      stock: product.stock,
      images: product.images,
      categoryId: String(product.categoryId),
      categoryName: product.category?.name
    }))
  }

  /**
   * Get complete dashboard data
   */
  async getDashboardData(): Promise<AdminDashboardDTO> {
    const [stats, recentOrders, lowStockProducts] = await Promise.all([
      this.getStats(),
      this.getRecentOrders(),
      this.getLowStockProducts()
    ])

    return {
      stats,
      recentOrders,
      lowStockProducts
    }
  }
}

// Singleton instance
export const adminDashboardService = new AdminDashboardService()
