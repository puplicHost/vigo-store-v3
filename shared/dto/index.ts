/**
 * DTO (Data Transfer Objects) - Enterprise-grade data contracts
 * All API responses should return these stable DTOs to ensure SSR safety
 */

// ============================================================================
// Dashboard DTOs
// ============================================================================

export interface DashboardStatsDTO {
  products: number
  categories: number
  orders: number
  users: number
  revenue: number
  paidOrders: number
  pendingOrders: number
  averageOrderValue: number
  adminUsers: number
  customerUsers: number
  staffUsers: number
}

export interface RecentOrderDTO {
  id: string
  displayId: string
  totalAmount: number
  userName: string
  userInitial: string
  status: string
  paymentStatus: string
  createdAt: string
}

export interface LowStockProductDTO {
  id: string
  name: string
  stock: number
  images: string[]
  categoryId: string
  categoryName?: string
}

export interface AdminDashboardDTO {
  stats: DashboardStatsDTO
  recentOrders: RecentOrderDTO[]
  lowStockProducts: LowStockProductDTO[]
}

// ============================================================================
// Product DTOs
// ============================================================================

export interface ProductDTO {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  discount: number | null
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  isFeatured: boolean
  isDeleted: boolean
  isActive: boolean
  categoryId: string
  categoryName?: string
  createdAt: string
  updatedAt: string
}

export interface ProductListDTO {
  products: ProductDTO[]
  total: number
  page: number
  limit: number
}

// ============================================================================
// Category DTOs
// ============================================================================

export interface CategoryDTO {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Order DTOs
// ============================================================================

export interface OrderItemDTO {
  id: string
  productId: string
  productName?: string
  productSlug?: string
  productImages?: string[]
  quantity: number
  price: number
}

export interface OrderDTO {
  id: string
  displayId: string
  userId: string
  userName?: string
  userEmail?: string
  totalAmount: number
  status: string
  paymentStatus: string
  paymentIntentId: string | null
  transactionId: string | null
  items: OrderItemDTO[]
  createdAt: string
  updatedAt: string
}

export interface OrderListDTO {
  orders: OrderDTO[]
  total: number
  page: number
  limit: number
}

// ============================================================================
// User DTOs
// ============================================================================

export interface UserDTO {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  createdAt: string
  updatedAt: string
}

export interface UserListDTO {
  users: UserDTO[]
  total: number
  page: number
  limit: number
}

// ============================================================================
// Settings DTOs
// ============================================================================

export interface SettingsDTO {
  shippingFee: number
  freeShippingThreshold: number
  currency: string
  contactEmail: string
  contactPhone: string | null
  contactAddress: string | null
  whatsappNumber: string | null
  maintenanceMode: boolean
  maintenanceMessage: string | null
  siteName: string
  siteDescription: string | null
  siteKeywords: string | null
  facebookUrl: string | null
  twitterUrl: string | null
  instagramUrl: string | null
  linkedinUrl: string | null
  tiktokUrl: string | null
  snapchatUrl: string | null
  stripePublicKey: string | null
  stripeSecretKey?: string | null
  isTestMode: boolean
  isCodEnabled: boolean
  isStripeEnabled: boolean
  isPaymobEnabled: boolean
  paymobApiKey?: string | null
  paymobIntegrationId?: string | null
  paymobIframeId?: string | null
  paymobHmacSecret?: string | null
  updatedAt: string
}
