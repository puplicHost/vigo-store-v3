/**
 * Global Search Composable
 * Provides debounced search functionality with state management
 */
export const useSearch = () => {
  const searchQuery = useState<string>('global_search_query', () => '')
  const isSearching = useState<boolean>('global_is_searching', () => false)

  // Debounce function
  const debounce = (fn: Function, delay: number) => {
    let timeoutId: any
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }
  }

  // Filter products based on search query
  const filterProducts = (products: any[], query: string) => {
    if (!query) return products
    const lowerQuery = query.toLowerCase()
    return products.filter(p =>
      p.name?.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.slug?.toLowerCase().includes(lowerQuery)
    )
  }

  // Filter orders based on search query
  const filterOrders = (orders: any[], query: string) => {
    if (!query) return orders
    const lowerQuery = query.toLowerCase()
    return orders.filter(o =>
      o.id?.toLowerCase().includes(lowerQuery) ||
      o.user?.name?.toLowerCase().includes(lowerQuery) ||
      o.user?.email?.toLowerCase().includes(lowerQuery) ||
      o.status?.toLowerCase().includes(lowerQuery)
    )
  }

  // Filter users based on search query
  const filterUsers = (users: any[], query: string) => {
    if (!query) return users
    const lowerQuery = query.toLowerCase()
    return users.filter(u =>
      u.name?.toLowerCase().includes(lowerQuery) ||
      u.email?.toLowerCase().includes(lowerQuery) ||
      u.role?.toLowerCase().includes(lowerQuery)
    )
  }

  // Filter categories based on search query
  const filterCategories = (categories: any[], query: string) => {
    if (!query) return categories
    const lowerQuery = query.toLowerCase()
    return categories.filter(c =>
      c.name?.toLowerCase().includes(lowerQuery)
    )
  }

  return {
    searchQuery,
    isSearching,
    filterProducts,
    filterOrders,
    filterUsers,
    filterCategories
  }
}
