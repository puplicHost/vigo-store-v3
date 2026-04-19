
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.product.count({
    where: { isDeleted: false, isActive: true }
  })
  console.log('Active products count:', count)
  const allCount = await prisma.product.count()
  console.log('Total products count:', allCount)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
