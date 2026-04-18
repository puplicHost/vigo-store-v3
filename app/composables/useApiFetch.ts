/**
 * Secure API Fetch with JWT Authentication
 * SSR-safe with reactive token handling and proper refetch logic
 */
export const useApiFetch = (url: string | (() => string), options: any = {}) => {
  const { token } = useAuth()
  
  // Use explicit key to avoid "incompatible options" warnings
  const key = options.key || (typeof url === 'function' ? url() : url)

  // Normalize response helper
  const transform = (res: any) => {
    // Standardize { data: [...] } or { items: [...] } or { settings: ... } or just [...]
    return res?.items || res?.data || res?.settings || res
  }

  // Create reactive headers
  const headers = computed(() => {
    const h: Record<string, string> = {
      ...(options.headers || {})
    }

    if (token.value) {
      h.Authorization = `Bearer ${token.value}`
    }

    // Add CSRF token from cookie
    if (import.meta.client) {
      const csrfToken = useCookie('csrf_token').value
      if (csrfToken) {
        h['x-csrf-token'] = csrfToken
      }
    }

    return h
  })

  const response = useFetch(url, {
    key,
    credentials: 'include',
    ...options,
    headers,
    transform: options.transform || transform,
    default: options.default || (() => null),
    // Watch token changes to refetch when token becomes available
    watch: [token],
    // Don't run on server if token is not ready
    server: process.server ? !!token.value : true
  })

  // Debug logging for request configuration
  if (process.env.NODE_ENV === 'development') {
    watch(
      () => [token.value, response.data.value, response.error.value],
      ([tokenVal, data, err]) => {
        console.log(`[API FETCH] ${key} - Token exists: ${!!tokenVal}, Data: ${!!data}, Error: ${!!err}`)
      },
      { immediate: true }
    )
  }

  // Safe error watcher
  watch(
    () => response.error.value,
    (err) => {
      if (err) {
        console.error(`[API ERROR] ${key}:`, err)
      }
    }
  )

  return response
}

/**
 * $fetch wrapper for mutations (POST, PATCH, DELETE)
 * Automatically includes JWT token and standardized error handling
 */
export const $apiFetch = async <T = any>(url: string, options: any = {}): Promise<T> => {
  const { token } = useAuth()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (token.value) {
    headers.Authorization = `Bearer ${token.value}`
  }

  // Add CSRF token from cookie
  if (import.meta.client) {
    const csrfToken = useCookie('csrf_token').value
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken
    }
  }

  try {
    return await $fetch<T>(url, {
      ...options,
      headers
    })
  } catch (error: any) {
    // Logs the error but lets the component handle the specific re-throw
    console.error('[API Fetch Error]:', error)
    throw error
  }
}
