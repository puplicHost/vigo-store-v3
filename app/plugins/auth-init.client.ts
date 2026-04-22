export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const { clearCart } = useCart()

  // Only run on client side
  if (import.meta.client) {
    onMounted(async () => {
      // If token exists but user doesn't, fetch user from server
      if (auth.token.value && !auth.user.value) {
        try {
          await auth.fetchUser()
        } catch (error) {
          console.error('[AUTH BOOTSTRAP] Failed to fetch user:', error)
          // If fetch fails (e.g., 401), auth state will be cleared by fetchUser
          // Clear user-dependent state and redirect to login
          clearCart()
          if (window.location.pathname !== '/auth/login') {
            navigateTo('/auth/login', { replace: true })
          }
        }
      } else if (!auth.token.value && auth.user.value) {
        // No token but user state exists - clear it
        auth.clearAuth()
      }
    })
  }
})
