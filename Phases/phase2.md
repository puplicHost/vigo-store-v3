Continue fixing Vigo Store. Now handle high-priority bugs:

### TASK 7 — Add Pagination to All List Endpoints
Files: 
- server/api/products/index.get.ts
- server/api/admin/orders/index.get.ts

Add query params: ?page=1&limit=20
Use Prisma skip/take:
  const page = parseInt(getQuery(event).page as string) || 1
  const limit = parseInt(getQuery(event).limit as string) || 20
  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
    prisma.product.findMany({ skip, take: limit, ... }),
    prisma.product.count({ where: ... })
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }

---

### TASK 8 — Create Missing Product PATCH Endpoint
Create file: server/api/admin/products/[id].patch.ts

Should:
- Require admin authentication
- Accept: name, description, price, stock, categoryId, isActive
- Validate all inputs
- Return updated product

---

### TASK 9 — Fix Categories Navigation Path
File: app/layouts/admin.vue

Find:
  { name: 'Categories', path: '/categories', ... }

Replace with:
  { name: 'Categories', path: '/admin/categories', ... }

---

### TASK 10 — Fix Stripe Secret Key Exposure
File: server/api/admin/settings/index.get.ts

Before returning settings, remove sensitive fields:
  const { stripeSecretKey, ...safeSettings } = settings
  return { success: true, settings: safeSettings }

Show me the full updated files.