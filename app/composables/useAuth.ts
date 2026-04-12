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
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  })
  
  const user = useState<User | null>('auth_user', () => null)
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
    
    try {
      const { data, error } = await useFetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      if (error.value) {
        clearAuth()
        return
      }
      
      if (data.value?.user) {
        user.value = data.value.user
      }
    } catch {
      clearAuth()
    }
  }
  
  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    setAuth,
    clearAuth,
    logout,
    fetchUser
  }
}
