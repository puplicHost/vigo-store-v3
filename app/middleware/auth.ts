export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()

  console.log('[AUTH MIDDLEWARE] Checking route:', to.path, {
    isAuthenticated: auth.isAuthenticated.value,
    isLoading: auth.isLoading.value,
    isAuthLoading: auth.isAuthLoading.value,
    hasToken: !!auth.token.value,
    hasUser: !!auth.user.value
  })

  // Prevent redirect loop - if already going to login, don't redirect again
  if (to.path === '/auth/login') {
    return
  }

  // Wait if auth is still loading (use isAuthLoading which is set by plugins)
  if (auth.isAuthLoading.value) {
    console.log('[AUTH MIDDLEWARE] Auth loading, waiting...')
    return
  }

  // Check if user is authenticated
  if (!auth.isAuthenticated.value) {
    console.log('[AUTH MIDDLEWARE] Not authenticated, redirecting to login')
    return navigateTo('/auth/login')
  }

  console.log('[AUTH MIDDLEWARE] Authenticated, allowing access')
})
