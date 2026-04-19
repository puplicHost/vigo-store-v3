
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.product.count({
    where: { isDeleted: false, isActive: true }
  })
  console.log('Active products count:', count)
  const allCount = await prisma.product.count()
  console.log('Total products count:', allCount)
  const products = await prisma.product.findMany({ take: 5 })
  console.log('Sample products:', JSON.stringify(products, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
