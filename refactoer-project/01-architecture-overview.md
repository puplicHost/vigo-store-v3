# 01-Architecture-Overview.md

## Executive Goal

إعادة تصميم Vigo Store v3 نحو **Architecture enterprise** تشبه نهج Shopify من حيث:

- الفصل القوي بين المجالات Domains (Catalog, Orders, Cart, Users, Settings, Admin)
- طبقات واضحة (API / Service / Repository / Validation / Policies)
- قابلية التوسع دون كسر SSR أو إدخال أخطاء runtime
- جاهزية للتشغيل على بيئات عالية الحمل (caching + jobs + DB optimization)

## High-Level Architecture (Text Diagram)

```text
                    ┌──────────────────────────────────┐
                    │            Nuxt 4 Frontend       │
                    │  - Store UI (SSR/CSR hybrid)      │
                    │  - Admin UI (RBAC + dashboards)   │
                    └──────────────────────────────────┘
                                      │
                                      │ HTTP (SSR requests / client fetch)
                                      ▼
                    ┌──────────────────────────────────┐
                    │                 Nitro            │
                    │  API Routes (thin controllers)  │
                    │  - auth middleware               │
                    │  - validation (Zod)             │
                    │  - services orchestration      │
                    └──────────────────────────────────┘
                                      │
                                      ▼
                    ┌──────────────────────────────────┐
                    │     Domain Services Layer       │
                    │  OrdersService, CatalogService  │
                    │  UsersService, SettingsService  │
                    │  AdminDashboardService           │
                    └──────────────────────────────────┘
                                      │
                                      ▼
                    ┌──────────────────────────────────┐
                    │   Repository Layer (Prisma)     │
                    │  - OrdersRepository             │
                    │  - ProductRepository           │
                    │  - UserRepository              │
                    │  - SettingsRepository          │
                    └──────────────────────────────────┘
                                      │
                                      ▼
                    ┌──────────────────────────────────┐
                    │        PostgreSQL + Prisma       │
                    │  - indexes                        │
                    │  - constraints & cascades        │
                    │  - migrations                    │
                    └──────────────────────────────────┘

        Cross-Cutting Concerns (shared across layers):
        ─ Auth (JWT + policies)  ─ RBAC/Permissions engine
        ─ Rate limiting           ─ Audit logging
        ─ Error mapping (domain -> http)
        ─ Observability (structured logs)
        ─ Cache strategy (Redis-ready)
```

## Domain-Driven Module Boundaries

تقسيم النظام إلى Domains (وليس “أنواع ملفات”):

1. **Identity & Access (Auth)**
   - Users, Roles, Permissions, JWT token lifecycle
   - Policies for Admin actions (read/write/delete)

2. **Catalog**
   - Products, Categories, Images, Pricing rules, Search indexing hooks

3. **Orders**
   - Order lifecycle (PENDING/PAID/SHIPPED/DELIVERED/CANCELLED)
   - Payment status tracking (PaymentStatus)

4. **Cart & Checkout**
   - Cart items, checkout session, order creation orchestration

5. **Settings**
   - Store settings (currency, shipping fees, SEO metadata)
   - Maintenance mode flag

6. **Admin**
   - Dashboard aggregation endpoints
   - “Bulk actions” endpoints
   - Admin audit and activity logs

## Data Flow Design (Key Flows)

### Flow A: Admin Dashboard Load (`GET /admin/dashboard`)

1. Browser/SSR requests `/admin/dashboard`
2. `admin layout` + `dashboard page` trigger server-side data fetch:
   - call “AdminDashboardService” through thin API endpoints
3. Services:
   - validate permissions with RBAC engine
   - aggregate stats from Orders/Catalog repositories
4. Repositories execute Prisma queries with:
   - pagination-safe defaults
   - strict selection fields (avoid heavy joins)
5. UI consumes normalized DTOs (view models) to avoid template crashes.

### Flow B: Update Order Status (Admin PATCH)

1. `PATCH /api/admin/orders/:id`
2. middleware/auth validates JWT and required permissions
3. handler validates body via Zod
4. service verifies allowed transition:
   - e.g. PAID -> SHIPPED (optional rules)
5. repository updates with safe enum usage and returns DTO
6. audit logging records admin action.

### Flow C: Checkout → Orders creation (Store)

1. Store checkout triggers `POST /api/checkout/*`
2. cart/checkout service validates cart
3. order service creates order within a transaction:
   - order + items + payment intent metadata
4. background job enqueues email confirmations / receipt generation.

## Frontend/Backend Separation

- Frontend UI:
  - responsibilities: presentation + local state + UX boundaries
  - never run DB logic directly
- Backend (Nitro):
  - responsibilities: data access + business rules + auth policies
  - always validate inputs and return stable DTOs

## Error Boundary & Stability Philosophy

لتجنب أخطاء مثل `IPC connection closed` / 500 SSR:

- Controllers map all domain errors to well-defined HTTP errors.
- Services never throw raw errors without mapping.
- UI uses safe view models:
  - template never assumes `id` is always string or `totalAmount` always number
  - charts remain `ClientOnly` and server output stays stable.

## Deliverables in Next Phases

الملفات القادمة ستقدم:

- `02` structure: folder layout enterprise-grade (domain-driven)
- `04` backend architecture: service/repository/api/validation/error strategy
- `06` security design: JWT + RBAC + audit + hardening
- `08` migration plan: safe refactor steps without breaking SSR
