// Permission types (synced with composables/usePermissions.ts)
type Permission =
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

// Role-based permission mappings (synced with composables/usePermissions.ts)
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

const getUserPermissions = (role: string): Permission[] => {
  return ROLE_PERMISSIONS[role] || []
}

const hasPermission = (user: any, permission: Permission): boolean => {
  if (!user) return false
  if (user.role === 'SUPER_ADMIN') return true

  const rolePermissions = getUserPermissions(user.role)
  return rolePermissions.includes(permission)
}

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth()

  // If user is not authenticated, let auth middleware handle it
  if (!auth.user.value) {
    return
  }

  // SUPER_ADMIN bypasses all permission checks
  if (auth.user.value.role === 'SUPER_ADMIN') {
    return
  }

  // Get required permission from page meta
  const requiredPermission = to.meta.permission as Permission

  if (requiredPermission && !hasPermission(auth.user.value, requiredPermission)) {
    return navigateTo('/403')
  }
})
