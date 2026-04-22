export interface User {
  id: string
  name: string | null
  email: string
  role: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuth = () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false // Client-side needs to read the token for SPA
  })

  const user = useState<User | null>('auth_user', () => null)
  const isLoading = useState<boolean>('auth_loading', () => false)
  const isAuthLoading = useState<boolean>('auth_bootstrap_loading', () => false)
  
  // isAuthenticated depends on BOTH token existence and successful user fetch
  // Server is single source of truth - we don't decode JWT on client
  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })
  
  // Set auth data after login
  const setAuth = (authToken: string, userData: User) => {
    token.value = authToken
    user.value = userData
  }
  
  // Clear auth data on logout
  const clearAuth = () => {
    token.value = null
    user.value = null
  }
  
  // Logout function
  const logout = () => {
    console.log('[AUTH] Logging out user')
    clearAuth()
  }
  
  // Fetch current user from server (single source of truth)
  const fetchUser = async () => {
    if (!token.value) return

    isLoading.value = true
    isAuthLoading.value = true

    try {
      const response = await $apiFetch('/api/auth/me') as any
      user.value = response.user
    } catch (error: any) {
      console.error('Failed to fetch user:', error)
      // If 401 or 404, clear auth and redirect
      if (error.statusCode === 401 || error.statusCode === 404) {
        clearAuth()
        // Only redirect if not already on login page
        if (import.meta.client && window.location.pathname !== '/auth/login') {
          navigateTo('/auth/login', { replace: true })
        }
      }
      // Network errors - silent fail, keep state as-is
    } finally {
      isLoading.value = false
      isAuthLoading.value = false
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    isLoading: readonly(isLoading),
    isAuthLoading: readonly(isAuthLoading),
    setAuth,
    clearAuth,
    logout,
    fetchUser
  }
}
