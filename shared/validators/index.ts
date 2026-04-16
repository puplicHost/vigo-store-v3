/**
 * Shared Validators - Zod validation schemas
 * Centralized validation contracts for API inputs
 */

import { z } from 'zod'

// ============================================================================
// Auth Validators
// ============================================================================

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional()
})

// ============================================================================
// Product Validators
// ============================================================================

export const CreateProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  discount: z.number().nonnegative('Discount cannot be negative').optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  isFeatured: z.boolean().optional(),
  categoryId: z.string().min(1, 'Category ID is required')
})

export const UpdateProductSchema = CreateProductSchema.partial()

// ============================================================================
// Category Validators
// ============================================================================

export const CreateCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters')
})

export const UpdateCategorySchema = CreateCategorySchema.partial()

// ============================================================================
// Order Validators
// ============================================================================

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'], 'Invalid order status')
})

// ============================================================================
// User Validators
// ============================================================================

export const UpdateUserRoleSchema = z.object({
  role: z.enum(['USER', 'SALES', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'], 'Invalid user role')
})

// ============================================================================
// Settings Validators
// ============================================================================

export const UpdateSettingsSchema = z.object({
  shippingFee: z.number().nonnegative('Shipping fee cannot be negative').optional(),
  freeShippingThreshold: z.number().nonnegative('Free shipping threshold cannot be negative').optional(),
  currency: z.string().length(3, 'Currency must be a 3-letter code').optional(),
  contactEmail: z.string().email('Invalid email address').optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  whatsappNumber: z.string().optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceMessage: z.string().optional(),
  siteName: z.string().optional(),
  siteDescription: z.string().optional(),
  siteKeywords: z.string().optional(),
  facebookUrl: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  instagramUrl: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  stripePublicKey: z.string().optional()
})

// ============================================================================
// Pagination Validators
// ============================================================================

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional()
})
