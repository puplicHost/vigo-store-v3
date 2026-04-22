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

  // Prevent redirect loop - if already going to login, don't redirect again
  if (to.path === '/auth/login') {
    return
  }

  const auth = useAuth()

  console.log('[ADMIN GUARD] Checking admin route:', to.path, {
    isAuthenticated: auth.isAuthenticated.value,
    isAuthLoading: auth.isAuthLoading.value,
    userRole: auth.user.value?.role
  })

  // Wait if auth is still loading (use isAuthLoading which is set by plugins)
  if (auth.isAuthLoading.value) {
    console.log('[ADMIN GUARD] Auth loading, waiting...')
    return
  }

  // Check if user is authenticated
  if (!auth.isAuthenticated.value) {
    console.log('[ADMIN GUARD] Unauthenticated, redirecting to login')
    return navigateTo('/auth/login')
  }

  // Check if user has required role
  const userRole = auth.user.value?.role
  const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'SALES', 'MANAGER']

  if (!userRole || !allowedRoles.includes(userRole)) {
    console.log('[ADMIN GUARD] Role rejected:', userRole)
    auth.logout()
    return navigateTo('/auth/login')
  }

  console.log('[ADMIN GUARD] Access granted')
})
