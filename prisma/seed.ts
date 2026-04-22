import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Create Super Admin
  const password = 'admin123'
  const hashedPassword = await bcrypt.hash(password, 10)

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@vigo.com' },
    update: {},
    create: {
      email: 'admin@vigo.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN'
    }
  })

  console.log('✅ Super Admin created.')

  // 2. Create Categories
  const categories = [
    { name: 'Outerwear' },
    { name: 'Essentials' },
    { name: 'Knitwear' },
    { name: 'Accessories' }
  ]

  const createdCategories = []
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat
    })
    createdCategories.push(created)
  }

  console.log('✅ Categories created.')

  // 3. Create Products
  const products = [
    {
      name: 'Signature Wool Trench',
      slug: 'signature-wool-trench',
      description: 'A timeless trench coat crafted from premium Italian wool. Structured silhouette with a modern drape.',
      price: 4500,
      stock: 12,
      isFeatured: true,
      categoryId: createdCategories.find(c => c.name === 'Outerwear')!.id,
      images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1000&q=80'],
      sizes: ['M', 'L', 'XL'],
      colors: ['#2D2926', '#C19A6B']
    },
    {
      name: 'Minimalist Cashmere Crewneck',
      slug: 'minimalist-cashmere-crewneck',
      description: 'Ultra-soft 100% cashmere sweater. The ultimate layering piece for the contemporary wardrobe.',
      price: 2800,
      stock: 25,
      isFeatured: true,
      categoryId: createdCategories.find(c => c.name === 'Knitwear')!.id,
      images: ['https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?w=1000&q=80'],
      sizes: ['S', 'M', 'L'],
      colors: ['#E5E4E2', '#36454F']
    },
    {
      name: 'Atelier Tailored Trouser',
      slug: 'atelier-tailored-trouser',
      description: 'High-waisted trousers with precise pleating. Made from a breathable wool-silk blend.',
      price: 1950,
      stock: 18,
      isFeatured: false,
      categoryId: createdCategories.find(c => c.name === 'Essentials')!.id,
      images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1000&q=80'],
      sizes: ['S', 'M', 'L'],
      colors: ['#1C1C1C']
    },
    {
      name: 'Sculptural Leather Tote',
      slug: 'sculptural-leather-tote',
      description: 'Geometric tote bag in vegetable-tanned leather. Hand-finished edges and minimalist hardware.',
      price: 3200,
      stock: 8,
      isFeatured: true,
      categoryId: createdCategories.find(c => c.name === 'Accessories')!.id,
      images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&q=80'],
      sizes: ['OS'],
      colors: ['#000000', '#4A3728']
    },
    {
      name: 'Linen Overshirt',
      slug: 'linen-overshirt',
      description: 'Relaxed fit overshirt in heavy-weight belgian linen. Perfect for transitional weather.',
      price: 1450,
      discount: 15,
      stock: 30,
      isFeatured: true,
      categoryId: createdCategories.find(c => c.name === 'Essentials')!.id,
      images: ['https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=1000&q=80'],
      sizes: ['M', 'L', 'XL'],
      colors: ['#F5F5DC', '#2E4053']
    }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    })
  }

  console.log('✅ Test products created.')

  // 4. Create Settings
  await prisma.settings.upsert({
    where: { id: 'default' }, // Assuming only one row
    update: {},
    create: {
      id: 'default',
      siteName: 'VIGO ATELIER',
      siteDescription: 'Premium Egyptian Fashion House',
      currency: 'EGP',
      contactEmail: 'concierge@vigo.store',
      contactPhone: '+20 100 000 000',
      whatsappNumber: '201000000000',
      freeShippingThreshold: 5000,
      shippingFee: 100
    }
  })

  console.log('✅ Default settings verified.')

  // 5. Create Payment Gateways
  // PAYMOB Gateway - only create if environment variables are present
  const paymobApiKey = process.env.PAYMOB_API_KEY
  const paymobIntegrationId = process.env.PAYMOB_INTEGRATION_ID
  const paymobIframeId = process.env.PAYMOB_IFRAME_ID
  const paymobHmacSecret = process.env.PAYMOB_HMAC_SECRET

  if (paymobApiKey && paymobIntegrationId && paymobIframeId && paymobHmacSecret) {
    await prisma.paymentGateway.upsert({
      where: { name: 'PAYMOB' },
      update: {
        isEnabled: true,
        config: {
          apiKey: paymobApiKey,
          integrationId: paymobIntegrationId,
          iframeId: paymobIframeId,
          hmacSecret: paymobHmacSecret
        }
      },
      create: {
        name: 'PAYMOB',
        isEnabled: true,
        config: {
          apiKey: paymobApiKey,
          integrationId: paymobIntegrationId,
          iframeId: paymobIframeId,
          hmacSecret: paymobHmacSecret
        }
      }
    })
    console.log('✅ PAYMOB Payment Gateway created from environment variables.')
  } else {
    console.log('⚠️  PAYMOB environment variables not found. PAYMOB gateway not seeded.')
    console.log('   Set these environment variables to enable PAYMOB:')
    console.log('   - PAYMOB_API_KEY')
    console.log('   - PAYMOB_INTEGRATION_ID')
    console.log('   - PAYMOB_IFRAME_ID')
    console.log('   - PAYMOB_HMAC_SECRET')
  }

  console.log('✅ Payment Gateways created.')
  console.log('🏁 Seeding complete.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
