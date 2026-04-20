/**
 * Orders Repository
 * Handles all database operations related to orders
 */

import prisma from '../../../utils/prisma'
import { OrderStatus } from '@prisma/client'
import type { OrderDTO, OrderListDTO, RecentOrderDTO } from '../../../../shared/dto'

export class OrdersRepository {
  /**
   * Find order by ID
   */
  async findById(id: string): Promise<OrderDTO | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                price: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!order) return null

    return this.toOrderDTO(order)
  }

  /**
   * Get recent orders for dashboard
   */
  async findRecent(limit: number = 5): Promise<RecentOrderDTO[]> {
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
   * List orders with pagination
   */
  async list(params: {
    page: number
    limit: number
    search?: string
    status?: string
  }): Promise<OrderListDTO> {
    const { page, limit, search, status } = params
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                  price: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ])

    return {
      orders: orders.map(order => this.toOrderDTO(order)),
      total,
      page,
      limit
    }
  }

  /**
   * Update order status
   */
  async updateStatus(id: string, status: string): Promise<OrderDTO> {
    const order = await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                price: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return this.toOrderDTO(order)
  }

  /**
   * Aggregate stats for dashboard
   */
  async aggregateStats() {
    const orders = await prisma.order.findMany({
      select: {
        totalAmount: true,
        status: true,
        paymentStatus: true
      }
    })

    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const paidOrders = orders.filter(o => o.paymentStatus === 'PAID').length
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length
    const averageOrderValue = orders.length > 0 ? revenue / orders.length : 0

    return {
      orders: orders.length,
      revenue,
      paidOrders,
      pendingOrders,
      averageOrderValue
    }
  }

  /**
   * Convert Prisma order to DTO
   */
  private toOrderDTO(order: any): OrderDTO {
    const idStr = String(order.id)
    return {
      id: idStr,
      displayId: idStr.slice(-8).toUpperCase(),
      userId: String(order.userId),
      userName: order.user?.name || null,
      userEmail: order.user?.email || null,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentIntentId: order.paymentIntentId,
      transactionId: order.transactionId,
      items: order.items.map((item: any) => ({
        id: String(item.id),
        productId: String(item.productId),
        productName: item.product?.name,
        productSlug: item.product?.slug,
        productImages: item.product?.images,
        quantity: item.quantity,
        price: Number(item.price)
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }
  }
}

// Singleton instance
export const ordersRepository = new OrdersRepository()
