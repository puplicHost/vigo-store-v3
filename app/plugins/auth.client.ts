export default defineNuxtPlugin(() => {
  const auth = useAuth()

  // On client-side initialization, if token exists but user is null, fetch user
  if (process.client) {
    const token = useCookie('auth_token')

    // Only fetch if token exists but user is not loaded
    if (token.value && !auth.user.value) {
      // Silently try to fetch user - if token is invalid (401), auth will be cleared
      auth.fetchUser().catch(() => {
        // Ignore errors - token might be expired, auth will be cleared by fetchUser
      })
    }
  }
})
