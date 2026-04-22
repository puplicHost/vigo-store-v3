export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const { clearCart } = useCart()
  
  // Only run on client side
  if (import.meta.client) {
    onMounted(async () => {
      // If token exists, fetch user from server
      if (auth.token.value) {
        try {
          await auth.fetchUser()
        } catch (error) {
          console.error('[Auth Bootstrap] Failed to fetch user:', error)
          // If fetch fails (e.g., 401), auth state will be cleared by fetchUser
          // Clear user-dependent state
          clearCart()
        }
      } else {
        // No token, ensure user state is null
        auth.clearAuth()
      }
    })
  }
})
