import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = 'admin123'
  const hashedPassword = await bcrypt.hash(password, 10)

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@vigo.com' },
    update: {}, // Don't update if exists
    create: {
      email: 'admin@vigo.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN'
    }
  })

  console.log('✅ Super Admin created/verified:')
  console.log(`   Email: ${superAdmin.email}`)
  console.log(`   Name: ${superAdmin.name}`)
  console.log(`   Role: ${superAdmin.role}`)
  console.log(`   ID: ${superAdmin.id}`)
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
