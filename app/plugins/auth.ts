export default defineNuxtPlugin(async () => {
  const auth = useAuth()

  // Only on server: if token cookie exists but user state is null, fetch user
  // This ensures SSR has the user info for initial page render
  if (import.meta.server && auth.token.value && !auth.user.value) {
    try {
      await auth.fetchUser()
    } catch (error) {
      console.error('[AUTH PLUGIN] Server-side fetch failed:', error)
    }
  }
})
