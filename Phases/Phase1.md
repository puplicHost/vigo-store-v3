You are an expert Nuxt 3 / TypeScript developer. I have a Nuxt 3 e-commerce project 
called Vigo Store with critical security issues. Fix them one by one.

## Project Stack:
- Nuxt 3 + TypeScript
- Prisma ORM
- JWT authentication
- Tailwind CSS

---

### TASK 1 — Fix Auth Cookie Security
File: server/api/auth/login.post.ts

Change the cookie config to:
setCookie(event, 'auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 60 * 60 * 24 * 7
})

Apply the same fix in: app/composables/useAuth.ts

---

### TASK 2 — Fix JWT_SECRET Fallback
File: server/utils/auth.ts

Replace:
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

With:
  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set')

---

### TASK 3 — Fix useAuth fetchUser Response
File: app/composables/useAuth.ts line ~52

Replace:
  user.value = response.data.value.user

With:
  user.value = response.user

---

### TASK 4 — Fix useApiFetch Reactivity
File: app/composables/useApiFetch.ts

Replace:
  return useFetch(url, fetchOptions.value)

With:
  return useFetch(url, fetchOptions)

---

### TASK 5 — Filter Deleted Products from Public API
File: server/api/products/index.get.ts

Add where clause:
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
      isActive: true
    },
    include: { category: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' }
  })

---

### TASK 6 — Add Rate Limiting on Auth Endpoints
Files: server/api/auth/login.post.ts, server/api/auth/register.post.ts

Create a simple in-memory rate limiter:
- Max 5 attempts per IP per minute
- Return 429 status if exceeded
- Add at the TOP of each handler before any logic

Show me the full updated files.