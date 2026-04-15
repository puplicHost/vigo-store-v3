import { describe, it, expect } from 'vitest'

describe('Dashboard Calculations', () => {
  describe('Revenue Calculation', () => {
    it('should calculate total revenue from paid orders only', () => {
      const orders = [
        { totalAmount: 100, paymentStatus: 'PAID' },
        { totalAmount: 200, paymentStatus: 'PAID' },
        { totalAmount: 50, paymentStatus: 'PENDING' },
        { totalAmount: 300, paymentStatus: 'PAID' }
      ]

      const paidOrders = orders.filter(o => o.paymentStatus === 'PAID')
      const revenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0)

      expect(revenue).toBe(600)
    })

    it('should return 0 when there are no paid orders', () => {
      const orders = [
        { totalAmount: 100, paymentStatus: 'PENDING' },
        { totalAmount: 200, paymentStatus: 'FAILED' }
      ]

      const paidOrders = orders.filter(o => o.paymentStatus === 'PAID')
      const revenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0)

      expect(revenue).toBe(0)
    })

    it('should handle empty orders array', () => {
      const orders: any[] = []
      const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
      expect(revenue).toBe(0)
    })
  })

  describe('Average Order Value', () => {
    it('should calculate average order value correctly', () => {
      const orders = [
        { totalAmount: 100, paymentStatus: 'PAID' },
        { totalAmount: 200, paymentStatus: 'PAID' },
        { totalAmount: 300, paymentStatus: 'PAID' }
      ]

      const paidOrders = orders.filter(o => o.paymentStatus === 'PAID')
      const average = paidOrders.length > 0
        ? paidOrders.reduce((sum, o) => sum + o.totalAmount, 0) / paidOrders.length
        : 0

      expect(average).toBe(200)
    })

    it('should return 0 when there are no paid orders', () => {
      const orders = [
        { totalAmount: 100, paymentStatus: 'PENDING' }
      ]

      const paidOrders = orders.filter(o => o.paymentStatus === 'PAID')
      const average = paidOrders.length > 0
        ? paidOrders.reduce((sum, o) => sum + o.totalAmount, 0) / paidOrders.length
        : 0

      expect(average).toBe(0)
    })
  })

  describe('Low Stock Detection', () => {
    it('should identify products with stock less than 10', () => {
      const products = [
        { name: 'Product A', stock: 5 },
        { name: 'Product B', stock: 15 },
        { name: 'Product C', stock: 8 },
        { name: 'Product D', stock: 20 }
      ]

      const lowStockProducts = products.filter(p => p.stock < 10)

      expect(lowStockProducts.length).toBe(2)
      expect(lowStockProducts.map(p => p.name)).toContain('Product A')
      expect(lowStockProducts.map(p => p.name)).toContain('Product C')
    })

    it('should return empty array when no products have low stock', () => {
      const products = [
        { name: 'Product A', stock: 15 },
        { name: 'Product B', stock: 20 }
      ]

      const lowStockProducts = products.filter(p => p.stock < 10)

      expect(lowStockProducts.length).toBe(0)
    })

    it('should sort low stock products by stock ascending', () => {
      const products = [
        { name: 'Product A', stock: 5 },
        { name: 'Product B', stock: 8 },
        { name: 'Product C', stock: 3 }
      ]

      const lowStockProducts = products
        .filter(p => p.stock < 10)
        .sort((a, b) => a.stock - b.stock)

      expect(lowStockProducts[0].name).toBe('Product C')
      expect(lowStockProducts[1].name).toBe('Product A')
      expect(lowStockProducts[2].name).toBe('Product B')
    })
  })

  describe('User Distribution', () => {
    it('should count admin users correctly', () => {
      const users = [
        { role: 'ADMIN' },
        { role: 'SUPER_ADMIN' },
        { role: 'USER' },
        { role: 'MANAGER' }
      ]

      const adminUsers = users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN')

      expect(adminUsers.length).toBe(2)
    })

    it('should count customer users correctly', () => {
      const users = [
        { role: 'USER' },
        { role: 'USER' },
        { role: 'ADMIN' }
      ]

      const customerUsers = users.filter(u => u.role === 'USER')

      expect(customerUsers.length).toBe(2)
    })

    it('should count staff users correctly', () => {
      const users = [
        { role: 'SALES' },
        { role: 'MANAGER' },
        { role: 'USER' }
      ]

      const staffUsers = users.filter(u => u.role === 'SALES' || u.role === 'MANAGER')

      expect(staffUsers.length).toBe(2)
    })
  })
})
