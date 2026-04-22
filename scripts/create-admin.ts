import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'superadmin@vigo.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN'
    }
  })
  
  console.log('✅ Super Admin created:', {
    id: admin.id,
    email: admin.email,
    role: admin.role
  })
  console.log('🔑 Login credentials:')
  console.log('   Email: superadmin@vigo.com')
  console.log('   Password: admin123')
}

main()
  .catch(e => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
