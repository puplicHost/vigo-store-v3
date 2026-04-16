# 07-Performance-Scaling.md

## Performance Objectives

- تقليل latency لأهم صفحات:
  - Store home + product lists
  - Admin dashboard
- تقليل load على PostgreSQL
- منع SSR timeouts التي قد تؤدي إلى IPC disconnect في dev/prod
- تجهيز مسار واضح للـ horizontal scaling (stateless workers + shared cache/queue)

## 1) Caching Strategy (Redis-ready)

### Cache Provider Interface

اعتمد Provider pattern:

- `CacheProvider.get(key)`
- `CacheProvider.set(key, value, ttlSeconds)`
- `CacheProvider.del(patternOrKey)`

Implementation:

- dev: in-memory
- prod: Redis

### Cache Targets (What to Cache)

1. **Settings**
   - Cache store settings with short TTL (e.g. 30–300s)
   - Invalidate when settings update route runs

2. **Catalog**
   - Product list by category + pagination
   - Product detail by slug
   - Keep TTL moderate and invalidate on product changes

3. **Admin Dashboard**
   - Aggregate stats (revenue/orders/users) cache قصيرة جدًا
   - مثال: TTL 15–60s

4. **Reference Data**
   - categories list
   - permissions map (static)

### Cache Invalidation Policy

لا تعتمد TTL فقط:

- عند update/create/delete product/category:
  - invalidate related keys
  - use versioned cache keys where possible (e.g. `catalog:v{n}:...`)

## 2) Background Jobs System

### What Goes to Jobs

- Database seed (admin only)
- Export to Excel/PDF
- Email notifications / webhooks
- PDF invoice generation (إن وجدت)

### Why

- منع blocking of Nitro request
- منع timeouts + reduce chance of dev IPC disconnect
- توفير retry/backoff for reliability

### Architecture

- Create a queue abstraction inside `server/shared/jobs`
- Use a worker process separate from Nitro
- HTTP routes:
  - enqueue job
  - return 202 + jobId
  - frontend polls job status or uses WebSocket (future)

## 3) SSR Optimization for Nuxt 4

### Rules

- أي UI heavy:
  - ApexCharts/DOM-only libs => `ClientOnly`
- Avoid waterfall SSR data fetching:
  - minimize number of concurrent SSR requests
  - or provide aggregated endpoints (e.g. dashboard stats in one call)

### Prefetch & Deduplication

- use stable `useAsyncData` keys
- deduplicate identical requests
- prefer server endpoints that return DTO normalized and safe

### Error Boundaries

في admin dashboard:

- كل widget:
  - handles its own error state
  - never crashes the entire page

## 4) DB Optimization

### Query Optimization

- repositories use `select` aggressively
  - avoid fetching heavy nested data for dashboard list
- avoid N+1 queries:
  - either join via include/select
  - or prefetch in a single query

### Pagination Contracts

- every list endpoint uses:
  - `limit` bounds
  - stable ordering (createdAt desc + id tie-breaker)
  - consistent response shape

### Indexing

Indexes according to access patterns:

- Orders:
  - `(status, createdAt desc)`
  - `(userId, createdAt desc)`
  - optional `(paymentStatus, createdAt desc)`
- Products:
  - `(isDeleted, isActive, createdAt desc)` (أو pattern حسب schema الجديد)
  - `(categoryId)`
- Users:
  - `(role, createdAt desc)`
  - `(email)` unique

### DB Connection Stability

- Prisma client singleton pattern
- avoid creating multiple Prisma clients
- ensure database migrations applied in deployments

## Definition of Done (Performance)

- `admin/dashboard` response time stable under load
- database CPU time reduced after caching
- no unhandled SSR crashes on widget updates
- background jobs complete reliably with retries

## Deliverable: Next Phase

الملف القادم `08-migration-plan.md` يضع خطوات refactor عملية بدون breaking SSR.
