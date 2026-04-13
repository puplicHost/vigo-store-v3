/**
 * Secure API Fetch with JWT Authentication
 * Automatically injects Authorization header for all admin API calls
 */
export const useApiFetch = (url: string, options: any = {}) => {
  const { token, isAuthenticated } = useAuth()

  // Create headers with Authorization
  const headers = computed(() => {
    const h: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    }

    // Add JWT token if available
    if (token.value) {
      h.Authorization = `Bearer ${token.value}`
    }

    return h
  })

  // Merge options with auth headers
  const fetchOptions = computed(() => ({
    ...options,
    headers: headers.value,
    // Add default error handler
    onResponseError({ response }: { response: any }) {
      // Handle 401 - redirect to login
      if (response.status === 401) {
        const { logout } = useAuth()
        logout()
        navigateTo('/auth/login')
      }
    }
  }))

  return useFetch(url, fetchOptions.value)
}

/**
 * $fetch wrapper for mutations (POST, PATCH, DELETE)
 * Automatically includes JWT token
 */
export const $apiFetch = async (url: string, options: any = {}) => {
  const { token } = useAuth()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (token.value) {
    headers.Authorization = `Bearer ${token.value}`
  }

  try {
    return await $fetch(url, {
      ...options,
      headers
    })
  } catch (error: any) {
    // Handle 401
    if (error?.response?.status === 401) {
      const { logout } = useAuth()
      logout()
      navigateTo('/auth/login')
    }
    throw error
  }
}
