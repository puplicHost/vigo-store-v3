import prisma from './prisma'

/**
 * Helper to check if user has admin or staff privileges
 * Use in admin-only routes after the auth middleware has attached user to context
 * Allowed roles: ADMIN, SUPER_ADMIN, SALES, MANAGER
 */
export function requireAdmin(event: any) {
  const user = event.context.user

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Please login to access this resource'
    })
  }

  const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'SALES', 'MANAGER']
  if (!allowedRoles.includes(user.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Forbidden - This resource requires admin or staff access. Your role: ${user.role}`
    })
  }

  return user
}

/**
 * Helper to check if user has SUPER_ADMIN privileges
 * Use in SUPER_ADMIN-only routes after the auth middleware has attached user to context
 * This is for sensitive operations like user deletion, role changes, and settings updates
 */
export function requireSuperAdmin(event: any) {
  const user = event.context.user

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Please login to access this resource'
    })
  }

  if (user.role !== 'SUPER_ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: `Forbidden - This resource requires Super Admin access. Your role: ${user.role}`
    })
  }

  return user
}

/**
 * Helper to check if user has specific role(s)
 * Use for flexible permission checks
 * @param event - H3 event object
 * @param roles - Array of allowed roles
 * @returns true if user has one of the allowed roles
 */
export function isRole(event: any, roles: string[]): boolean {
  const user = event.context.user

  if (!user) {
    return false
  }

  return roles.includes(user.role)
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
