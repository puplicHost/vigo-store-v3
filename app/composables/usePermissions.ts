import type { Permission } from '@shared/constants/permissions'
import { ROLE_PERMISSIONS } from '@shared/constants/permissions'

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
