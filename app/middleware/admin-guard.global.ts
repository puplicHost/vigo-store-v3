/**
 * Global Admin Route Guard
 * Protects all /admin routes by checking authentication and role permissions
 * This runs before the route loads, preventing UI flickering
 */
export default defineNuxtRouteMiddleware((to) => {
  // Only protect admin routes
  if (!to.path.startsWith('/admin')) {
    return
  }

  const auth = useAuth()

  // Wait if auth is still loading (useful if we're fetching user on init)
  if (auth.isLoading.value) {
    return
  }

  // Check if user is authenticated
  if (!auth.isAuthenticated.value) {
    // #region agent log
    if (import.meta.client) {
      debugProjectLog({
        hypothesisId: 'H4',
        location: 'admin-guard.global.ts',
        message: 'admin unauthenticated redirect',
        data: { path: to.path }
      })
    }
    // #endregion
    return navigateTo('/auth/login')
  }

  // Check if user has required role
  const userRole = auth.user.value?.role
  const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'SALES', 'MANAGER']

  if (!userRole || !allowedRoles.includes(userRole)) {
    // #region agent log
    if (import.meta.client) {
      debugProjectLog({
        hypothesisId: 'H5',
        location: 'admin-guard.global.ts',
        message: 'admin role rejected',
        data: { path: to.path, userRole: userRole || null }
      })
    }
    // #endregion
    auth.logout()
    return navigateTo('/auth/login')
  }
})
