import { H3Event } from 'h3'
import type { Permission } from '../../shared/constants/permissions'
import { ROLE_PERMISSIONS } from '../../shared/constants/permissions'

// Get permissions for a user based on their role
export function getUserPermissions(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

// Check if user has a specific permission
export function hasPermission(
  event: H3Event,
  permission: Permission
): boolean {
  // Get user from auth middleware
  const user = event.context.user

  if (!user) {
    return false
  }

  // SUPER_ADMIN bypasses all permission checks
  if (user.role === 'SUPER_ADMIN') {
    return true
  }

  // Get permissions for user's role
  const rolePermissions = getUserPermissions(user.role)

  return rolePermissions.includes(permission)
}

// Require permission - throws error if user doesn't have permission
export function requirePermission(
  event: H3Event,
  permission: Permission
): void {
  const hasAccess = hasPermission(event, permission)

  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      statusMessage: `Permission denied: ${permission} required`
    })
  }
}

// Check multiple permissions (user needs at least one)
export function hasAnyPermission(
  event: H3Event,
  permissions: Permission[]
): boolean {
  const user = event.context.user

  if (!user) {
    return false
  }

  if (user.role === 'SUPER_ADMIN') {
    return true
  }

  const rolePermissions = getUserPermissions(user.role)

  return permissions.some((permission) => rolePermissions.includes(permission))
}

// Check multiple permissions (user needs all)
export function hasAllPermissions(
  event: H3Event,
  permissions: Permission[]
): boolean {
  const user = event.context.user

  if (!user) {
    return false
  }

  if (user.role === 'SUPER_ADMIN') {
    return true
  }

  const rolePermissions = getUserPermissions(user.role)

  return permissions.every((permission) => rolePermissions.includes(permission))
}
