/**
 * Secure API Fetch with JWT Authentication
 * Automatically injects Authorization header for all admin API calls
 */
export const useApiFetch = (url: string | (() => string), options: any = {}) => {
  const { token } = useAuth()

  // Create reactive headers
  const headers = computed(() => {
    const h: Record<string, string> = {
      ...unref(options.headers)
    }

    if (token.value) {
      h.Authorization = `Bearer ${token.value}`
    }

    return h
  })

  // Normalize response helper
  const transform = (res: any) => {
    // Standardize { data: [...] } or { items: [...] } or just [...]
    return res?.data || res?.items || res
  }

  const fetchResponse = useFetch(url, {
    ...options,
    headers,
    transform: options.transform || transform
  })

  // Global error watcher for debugging/feedback
  watch(fetchResponse.error, (err) => {
    if (err) {
      console.error(`[API Error] ${unref(url)}:`, err)
    }
  })

  return fetchResponse
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
    // Don't auto-logout on 401 - let the component handle it
    throw error
  }
}
