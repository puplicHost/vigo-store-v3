/**
 * Secure API Fetch with JWT Authentication
 * Refactored for stability and correct Vue reactivity
 */
export const useApiFetch = (url: string | (() => string), options: any = {}) => {
  const { token } = useAuth()
  
  // Use explicit key to avoid "incompatible options" warnings
  const key = options.key || (typeof url === 'function' ? url() : url)

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
    // Standardize { data: [...] } or { items: [...] } or { settings: ... } or just [...]
    return res?.items || res?.data || res?.settings || res
  }

  const response = useFetch(url, {
    key,
    credentials: 'include',
    ...options,
    headers,
    transform: options.transform || transform,
    default: options.default || (() => null),
    watch: false // Disable default watch as requested for manual control
  })

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
    // Logs the error but lets the component handle the specific re-throw
    console.error('[API Fetch Error]:', error)
    throw error
  }
}
