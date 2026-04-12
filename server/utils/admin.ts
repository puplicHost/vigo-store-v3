import prisma from './prisma'

/**
 * Helper to check if user has admin privileges
 * Use in admin-only routes after the auth middleware has attached user to context
 */
export function requireAdmin(event: any) {
  const user = event.context.user

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Please login'
    })
  }

  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Admin access required'
    })
  }

  return user
}

/**
 * Simple slug generator (no external dependency needed)
 * Converts "Product Name" -> "product-name"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
}
