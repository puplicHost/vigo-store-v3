import prisma from './prisma'
import { H3Event } from 'h3'

// Permission types as strings
export type Permission =
  | 'VIEW_PRODUCTS'
  | 'CREATE_PRODUCTS'
  | 'EDIT_PRODUCTS'
  | 'DELETE_PRODUCTS'
  | 'VIEW_ORDERS'
  | 'UPDATE_ORDER_STATUS'
  | 'VIEW_USERS'
  | 'MANAGE_USERS'
  | 'MANAGE_SETTINGS'
  | 'VIEW_CATEGORIES'
  | 'MANAGE_CATEGORIES'

// Role-based permission mappings
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: [
    'VIEW_PRODUCTS',
    'CREATE_PRODUCTS',
    'EDIT_PRODUCTS',
    'DELETE_PRODUCTS',
    'VIEW_ORDERS',
    'UPDATE_ORDER_STATUS',
    'VIEW_USERS',
    'MANAGE_USERS',
    'MANAGE_SETTINGS',
    'VIEW_CATEGORIES',
    'MANAGE_CATEGORIES'
  ],
  ADMIN: [
    'VIEW_PRODUCTS',
    'CREATE_PRODUCTS',
    'EDIT_PRODUCTS',
    'DELETE_PRODUCTS',
    'VIEW_ORDERS',
    'UPDATE_ORDER_STATUS',
    'VIEW_CATEGORIES',
    'MANAGE_CATEGORIES'
  ],
  MANAGER: [
    'VIEW_PRODUCTS',
    'CREATE_PRODUCTS',
    'EDIT_PRODUCTS',
    'VIEW_ORDERS',
    'UPDATE_ORDER_STATUS',
    'VIEW_CATEGORIES',
    'MANAGE_CATEGORIES'
  ],
  SALES: [
    'VIEW_ORDERS',
    'UPDATE_ORDER_STATUS'
  ],
  USER: []
}

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
