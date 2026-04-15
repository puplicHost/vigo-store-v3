export default defineNuxtPlugin(async () => {
  const auth = useAuth()

  // On both server and client: if token cookie exists but user state is null, fetch user
  // This ensures SSR has the user info and avoids redirection to login on refresh
  if (auth.token.value && !auth.user.value) {
    try {
      await auth.fetchUser()
    } catch (error) {
      // If fetching fails (e.g. invalid token), user stays null and auth might be cleared
      console.error('[Auth Plugin] Initial fetch failed:', error)
    }
  }
})
