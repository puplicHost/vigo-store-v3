import { z } from 'zod'

// Login Schema
export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

// Register Schema
export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
})

// Product Schema
export const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  discount: z.number().min(0).optional().nullable(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional()
})

// Update Product Schema (all fields optional)
// Coerce numeric fields: JSON from forms often sends strings for <input type="number">.
export const UpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  // Preserve null (do not coerce null → 0)
  discount: z.union([z.null(), z.coerce.number().min(0)]).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  categoryId: z.string().min(1).optional(),
  images: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional()
})
