/**
 * RBAC Engine - Role-Based Access Control
 * Policy-based authorization engine for fine-grained access control
 */

import type { Permission } from '../../../shared/constants/permissions'
import { ROLE_PERMISSIONS } from '../../../shared/constants/permissions'
import { AuthorizationError } from '../../../shared/errors/domain-errors'

export interface UserContext {
  userId: string
  role: string
  permissions?: Permission[]
}

export interface Policy {
  resource: string
  action: string
  permissions: Permission[]
  roles?: string[]
}

export class RBACEngine {
  /**
   * Check if user has a specific permission
   */
  hasPermission(user: UserContext, permission: Permission): boolean {
    // SUPER_ADMIN has all permissions
    if (user.role === 'SUPER_ADMIN') {
      return true
    }

    // Check if user has the permission from their role
    const rolePermissions = ROLE_PERMISSIONS[user.role] || []
    if (rolePermissions.includes(permission)) {
      return true
    }

    // Check if user has the permission from their individual permissions (if any)
    if (user.permissions && user.permissions.includes(permission)) {
      return true
    }

    return false
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(user: UserContext, permissions: Permission[]): boolean {
    // SUPER_ADMIN has all permissions
    if (user.role === 'SUPER_ADMIN') {
      return true
    }

    const rolePermissions = ROLE_PERMISSIONS[user.role] || []
    const userPermissions = user.permissions || []

    return permissions.some(permission => 
      rolePermissions.includes(permission) || userPermissions.includes(permission)
    )
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(user: UserContext, permissions: Permission[]): boolean {
    // SUPER_ADMIN has all permissions
    if (user.role === 'SUPER_ADMIN') {
      return true
    }

    const rolePermissions = ROLE_PERMISSIONS[user.role] || []
    const userPermissions = user.permissions || []

    return permissions.every(permission => 
      rolePermissions.includes(permission) || userPermissions.includes(permission)
    )
  }

  /**
   * Check if user has permission based on a policy
   */
  checkPolicy(user: UserContext, policy: Policy): boolean {
    // SUPER_ADMIN bypasses all policies
    if (user.role === 'SUPER_ADMIN') {
      return true
    }

    // Check role-based policy
    if (policy.roles && policy.roles.includes(user.role)) {
      return true
    }

    // Check permission-based policy
    return this.hasAnyPermission(user, policy.permissions)
  }

  /**
   * Authorize user for a specific action on a resource
   * Throws AuthorizationError if not authorized
   */
  authorize(user: UserContext, resource: string, action: string, requiredPermissions: Permission[]): void {
    if (!this.hasAnyPermission(user, requiredPermissions)) {
      throw new AuthorizationError(
        `You do not have permission to ${action} on ${resource}. Required permissions: ${requiredPermissions.join(', ')}`
      )
    }
  }

  /**
   * Get all permissions for a user (role + individual)
   */
  getUserPermissions(user: UserContext): Permission[] {
    // SUPER_ADMIN has all permissions
    if (user.role === 'SUPER_ADMIN') {
      return Object.values(ROLE_PERMISSIONS).flat()
    }

    const rolePermissions = ROLE_PERMISSIONS[user.role] || []
    const userPermissions = user.permissions || []

    // Combine and deduplicate
    return Array.from(new Set([...rolePermissions, ...userPermissions]))
  }

  /**
   * Check if user can access admin area
   */
  canAccessAdmin(user: UserContext): boolean {
    const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES']
    return adminRoles.includes(user.role)
  }
}

// Singleton instance
export const rbacEngine = new RBACEngine()
