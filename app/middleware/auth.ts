export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()
  
  // Wait if auth is still loading
  if (auth.isLoading.value) {
    return
  }

  // Check if user is authenticated
  if (!auth.isAuthenticated.value) {
    return navigateTo('/auth/login')
  }
})
