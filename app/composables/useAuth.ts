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
    // Note: httpOnly cannot be set from client-side composable
    // It must be set from server-side (login API)
  })

  const user = useState<User | null>('auth_user', () => null)
  const isLoading = useState<boolean>('auth_loading', () => false)
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  
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
    clearAuth()
    navigateTo('/auth/login')
  }
  
  // Fetch current user (useful on app init)
  const fetchUser = async () => {
    if (!token.value) return

    isLoading.value = true

    try {
      const response = await $apiFetch('/api/auth/me') as any
      user.value = response.data.value.user
    } catch (error) {
      console.error('Failed to fetch user:', error)
      // If 401, clear auth
      clearAuth()
    } finally {
      isLoading.value = false
    }
  }

  // Auto-fetch user on mount if token exists but user not loaded
  onMounted(() => {
    if (token.value && !user.value && process.client) {
      fetchUser()
    }
  })

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    isLoading: readonly(isLoading),
    setAuth,
    clearAuth,
    logout,
    fetchUser
  }
}
