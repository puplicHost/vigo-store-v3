// Permission types (synced with server/utils/permissions.ts)
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

// Role-based permission mappings (synced with server/utils/permissions.ts)
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

export const usePermissions = () => {
  const auth = useAuth()

  // Get permissions for user's role
  const getUserPermissions = (role: string): Permission[] => {
    return ROLE_PERMISSIONS[role] || []
  }

  // Check if user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    const user = auth.user.value
    if (!user) return false

    // SUPER_ADMIN bypasses all permission checks
    if (user.role === 'SUPER_ADMIN') return true

    const rolePermissions = getUserPermissions(user.role)
    return rolePermissions.includes(permission)
  }

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    const user = auth.user.value
    if (!user) return false

    if (user.role === 'SUPER_ADMIN') return true

    const rolePermissions = getUserPermissions(user.role)
    return permissions.some((permission) => rolePermissions.includes(permission))
  }

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    const user = auth.user.value
    if (!user) return false

    if (user.role === 'SUPER_ADMIN') return true

    const rolePermissions = getUserPermissions(user.role)
    return permissions.every((permission) => rolePermissions.includes(permission))
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserPermissions
  }
}
