import type { Permission } from '../../shared/constants/permissions'
import { ROLE_PERMISSIONS } from '../../shared/constants/permissions'

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
