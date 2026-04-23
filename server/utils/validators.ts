import { z } from 'zod'

// Login Schema
export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
})

// Register Schema
export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format'),
  password: z.string()
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
