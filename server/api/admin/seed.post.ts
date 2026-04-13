import prisma from '../../utils/prisma'
import { requireSuperAdmin } from '../../utils/admin'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  // Only SUPER_ADMIN can seed data
  requireSuperAdmin(event)

  try {
    // Check if data already exists
    const existingUsers = await prisma.user.count()
    const existingProducts = await prisma.product.count()
    
    if (existingUsers > 1 || existingProducts > 0) {
      return createError({
        statusCode: 400,
        statusMessage: 'Database already contains data. Clear it first if you want to reseed.'
      })
    }

    // Seed Users
    const usersData = [
      { name: 'Ahmed Mohamed', email: 'ahmed.admin@vigo.com', password: 'admin123', role: 'ADMIN' },
      { name: 'Sarah Ali', email: 'sarah.admin@vigo.com', password: 'admin123', role: 'ADMIN' },
      { name: 'Omar Hassan', email: 'omar.manager@vigo.com', password: 'manager123', role: 'MANAGER' },
      { name: 'Fatima Khalil', email: 'fatima.manager@vigo.com', password: 'manager123', role: 'MANAGER' },
      { name: 'Mahmoud Ibrahim', email: 'mahmoud.sales@vigo.com', password: 'sales123', role: 'SALES' },
      { name: 'Nour Ahmed', email: 'nour.sales@vigo.com', password: 'sales123', role: 'SALES' },
      { name: 'Youssef Sayed', email: 'youssef.sales@vigo.com', password: 'sales123', role: 'SALES' },
      { name: 'Ali Mahmoud', email: 'ali.customer@gmail.com', password: 'customer123', role: 'USER' },
      { name: 'Mona Hassan', email: 'mona.customer@gmail.com', password: 'customer123', role: 'USER' },
      { name: 'Karim Fathy', email: 'karim.customer@gmail.com', password: 'customer123', role: 'USER' },
      { name: 'Laila Omar', email: 'laila.customer@gmail.com', password: 'customer123', role: 'USER' },
      { name: 'Hassan Mohamed', email: 'hassan.customer@gmail.com', password: 'customer123', role: 'USER' },
      { name: 'Amina Khalil', email: 'amina.customer@gmail.com', password: 'customer123', role: 'USER' },
      { name: 'Tarek Ibrahim', email: 'tarek.customer@gmail.com', password: 'customer123', role: 'USER' },
      { name: 'Salma Sayed', email: 'salma.customer@gmail.com', password: 'customer123', role: 'USER' },
    ]

    const users = await Promise.all(
      usersData.map(async (userData) => {
        const password = await bcrypt.hash(userData.password, 10)
        return prisma.user.create({
          data: {
            ...userData,
            password
          }
        })
      })
    )

    // Get or Create Categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Clothing' },
        update: {},
        create: { name: 'Clothing' }
      }),
      prisma.category.upsert({
        where: { name: 'Accessories' },
        update: {},
        create: { name: 'Accessories' }
      }),
      prisma.category.upsert({
        where: { name: 'Footwear' },
        update: {},
        create: { name: 'Footwear' }
      }),
      prisma.category.upsert({
        where: { name: 'Bags' },
        update: {},
        create: { name: 'Bags' }
      })
    ])

    const categoryMap: Record<string, string> = {
      'Clothing': categories[0].id,
      'Accessories': categories[1].id,
      'Footwear': categories[2].id,
      'Bags': categories[3].id
    }

    // Seed Products
    const productsData = [
      { name: 'Silk Blouse', slug: 'silk-blouse', price: 450, stock: 25, category: 'Clothing', images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400'], sizes: ['S', 'M', 'L'], colors: ['White', 'Black', 'Beige'] },
      { name: 'Linen Dress', slug: 'linen-dress', price: 650, stock: 15, category: 'Clothing', images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'], sizes: ['S', 'M', 'L'], colors: ['Beige', 'Pink'] },
      { name: 'Cotton Shirt', slug: 'cotton-shirt', price: 320, stock: 40, category: 'Clothing', images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400'], sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Blue', 'Grey'] },
      { name: 'Wool Blazer', slug: 'wool-blazer', price: 1200, stock: 8, category: 'Clothing', images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400'], sizes: ['S', 'M', 'L'], colors: ['Navy', 'Black', 'Grey'] },
      { name: 'Cashmere Sweater', slug: 'cashmere-sweater', price: 850, stock: 12, category: 'Clothing', images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Cream', 'Black', 'Brown'] },
      { name: 'Denim Jacket', slug: 'denim-jacket', price: 550, stock: 20, category: 'Clothing', images: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue', 'Black'] },
      { name: 'Silk Scarf', slug: 'silk-scarf', price: 180, stock: 50, category: 'Accessories', images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400'], sizes: ['One Size'], colors: ['Red', 'Blue', 'Pink', 'Black'] },
      { name: 'Leather Belt', slug: 'leather-belt', price: 220, stock: 30, category: 'Accessories', images: ['https://images.unsplash.com/photo-1553704591-8d9077c9b8f9?w=400'], sizes: ['S', 'M', 'L'], colors: ['Brown', 'Black'] },
      { name: 'Gold Necklace', slug: 'gold-necklace', price: 1500, stock: 5, category: 'Accessories', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'], sizes: ['One Size'], colors: ['Gold'] },
      { name: 'Sunglasses', slug: 'sunglasses', price: 350, stock: 25, category: 'Accessories', images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'], sizes: ['One Size'], colors: ['Black', 'Tortoise'] },
      { name: 'Leather Loafers', slug: 'leather-loafers', price: 750, stock: 15, category: 'Footwear', images: ['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400'], sizes: ['40', '41', '42', '43', '44'], colors: ['Brown', 'Black'] },
      { name: 'Sneakers', slug: 'sneakers', price: 450, stock: 35, category: 'Footwear', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'], sizes: ['40', '41', '42', '43', '44'], colors: ['White', 'Black', 'Red'] },
      { name: 'Chelsea Boots', slug: 'chelsea-boots', price: 680, stock: 18, category: 'Footwear', images: ['https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400'], sizes: ['40', '41', '42', '43', '44'], colors: ['Black', 'Brown'] },
      { name: 'Leather Tote Bag', slug: 'leather-tote-bag', price: 950, stock: 10, category: 'Bags', images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'], sizes: ['One Size'], colors: ['Black', 'Brown', 'Tan'] },
      { name: 'Crossbody Bag', slug: 'crossbody-bag', price: 420, stock: 22, category: 'Bags', images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400'], sizes: ['One Size'], colors: ['Black', 'Red', 'Navy'] },
      { name: 'Backpack', slug: 'backpack', price: 380, stock: 28, category: 'Bags', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'], sizes: ['One Size'], colors: ['Black', 'Grey', 'Navy'] },
      { name: 'Clutch Bag', slug: 'clutch-bag', price: 320, stock: 15, category: 'Bags', images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'], sizes: ['One Size'], colors: ['Gold', 'Silver', 'Black'] },
      { name: 'Evening Gown', slug: 'evening-gown', price: 1800, stock: 3, category: 'Clothing', images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400'], sizes: ['S', 'M', 'L'], colors: ['Black', 'Red', 'Emerald'] },
      { name: 'Trench Coat', slug: 'trench-coat', price: 1100, stock: 7, category: 'Clothing', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400'], sizes: ['S', 'M', 'L'], colors: ['Beige', 'Black', 'Navy'] },
      { name: 'Pleated Skirt', slug: 'pleated-skirt', price: 280, stock: 33, category: 'Clothing', images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0uj78?w=400'], sizes: ['S', 'M', 'L'], colors: ['Black', 'Red', 'Pink'] },
      { name: 'Running Shoes', slug: 'running-shoes', price: 520, stock: 40, category: 'Footwear', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'], sizes: ['40', '41', '42', '43', '44'], colors: ['White', 'Black', 'Blue'] },
    ]

    const products = await Promise.all(
      productsData.map((productData) =>
        prisma.product.create({
          data: {
            name: productData.name,
            slug: productData.slug,
            price: productData.price,
            stock: productData.stock,
            images: productData.images,
            sizes: productData.sizes,
            colors: productData.colors,
            categoryId: categoryMap[productData.category]
          }
        })
      )
    )

    // Seed Orders (30+ orders across last 30 days)
    const orderStatuses: any[] = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    const paymentStatuses: any[] = ['PENDING', 'PAID', 'FAILED', 'REFUNDED']
    const customerUsers = users.filter(u => u.role === 'USER')
    
    const orders = []
    const now = new Date()
    
    for (let i = 0; i < 35; i++) {
      const customer = customerUsers[Math.floor(Math.random() * customerUsers.length)]
      const numProducts = Math.floor(Math.random() * 3) + 1
      const selectedProducts = []
      let totalAmount = 0
      
      for (let j = 0; j < numProducts; j++) {
        const product = products[Math.floor(Math.random() * products.length)]
        const quantity = Math.floor(Math.random() * 3) + 1
        selectedProducts.push({
          product,
          quantity,
          price: product.price
        })
        totalAmount += product.price * quantity
      }

      const daysAgo = Math.floor(Math.random() * 30)
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
      
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)]
      let paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)]
      
      // Ensure payment status matches order status
      if (status === 'PAID' || status === 'SHIPPED' || status === 'DELIVERED') {
        paymentStatus = 'PAID'
      } else if (status === 'CANCELLED') {
        paymentStatus = Math.random() > 0.5 ? 'FAILED' : 'REFUNDED'
      }

      const order = await prisma.order.create({
        data: {
          userId: customer.id,
          totalAmount,
          status,
          paymentStatus,
          transactionId: paymentStatus === 'PAID' ? `txn_${Date.now()}_${i}` : null,
          createdAt,
          items: {
            create: selectedProducts.map(item => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: true
        }
      })
      
      orders.push(order)
    }

    return {
      success: true,
      message: 'Database seeded successfully',
      data: {
        users: users.length,
        categories: categories.length,
        products: products.length,
        orders: orders.length
      }
    }
  } catch (error: any) {
    console.error('[Seed Error]:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'Failed to seed database: ' + error.message
    })
  }
})
