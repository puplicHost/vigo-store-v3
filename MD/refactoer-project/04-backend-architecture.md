# 04-Backend-Architecture.md

## Backend Layering (Mandatory)

### 1) Nitro Middleware Layer (Cross-cutting)

مسؤوليات:

- `auth`: attach actor context to request (userId, role, tenantId)
- `permissions`: enforce RBAC policy for endpoint or route meta
- `rate-limit`: protect from abuse
- `audit`: record admin actions (can hook after handler)
- `maintenance`: decide whether to block/allow requests
- `request-id`: generate correlation id for logs

قاعدة ذهبية:

- Middleware لا تقوم بعمل Prisma queries إلا عند الضرورة القصوى.
- أي exception في middleware لازم يتم تحويلها إلى error response واضحة بدل إسقاط worker.

### 2) API Adapters Layer (Thin Controllers)

مسؤوليات:

- parse request
- validate using Zod
- call service
- map service output to response JSON
- catch domain errors and map to HTTP

لا يُسمح بوضع:

- business rules
- Prisma queries مباشرة
- complex aggregation in API files

### 3) Domain Services Layer (Business Logic)

مسؤوليات:

- orchestration بين repositories
- enforce business invariants (status transitions, ownership rules)
- compute dashboard aggregation (AdminDashboardService)
- call background job scheduler when needed

### 4) Repository Layer (Database Abstraction)

مسؤوليات:

- تنفيذ Prisma queries
- stable selection fields
- hide Prisma implementation details

Repositories يجب أن تُرجع:

- DTO objects
- أو plain JS objects normalized (no Prisma-specific shapes)

### 5) Validation & Contracts

- Zod validation للمدخلات (body/query/params)
- contracts للـ DTOs (optional runtime validation in debug mode)

## Service Layer Design (Enterprise Patterns)

### Command / Query Separation (Lightweight CQRS)

للأداء والاستقرار:

- **Commands** (mutations): change state and write audit logs
  - `UpdateOrderStatusCommand`
  - `DeleteUserCommand`
  - `SeedDatabaseCommand` (admin only)

- **Queries** (read-only): optimized selects for dashboard lists
  - `RecentOrdersQuery`
  - `DashboardStatsQuery`
  - `LowStockProductsQuery`

حتى لو لم يتم تقديم إطار CQRS كامل، هذا الفصل داخل services يضمن:

- واضح ما يكتب وما يقرأ
- يقلل coupling ويمنع mistakes مثل تشغيل mutation في query path

### Transaction Management

أي عمليات تتضمن أكثر من repository:

- يجب أن تُنفذ داخل transaction عند الحاجة.

أمثلة:

- checkout: create order + items + payment metadata
- status update: verify transition + update order + append audit log

## Repository Pattern (How to Apply)

لكل domain:

- واجهات Repository (TypeScript types)
- Implementations تستخدم Prisma

مثال نمطي (بدون كود كامل):

- `OrdersRepository`
  - `findById(id): OrderDTO | null`
  - `findRecent(limit): RecentOrderDTO[]`
  - `updateStatus(id, status, actor): OrderDTO`
  - `aggregateStats(period): DashboardStatsDTO`

- `UsersRepository`
  - `findById(id)`
  - `listUsers(filter, pagination)`
  - `deleteUserSafely(id, actor)` (enforce invariants / restrictions)

## Validation Layer (Zod Integration)

قاعدة:

- Controllers لا يمررون payload غير مُتحقق.
- Zod schemas live in `shared/validators/*` أو `server/domains/*/validators/*`.

مستويات validation:

1. **Input validation**: shape + enum constraints + numeric bounds
2. **Authorization validation**: actor has permission and entity ownership
3. **Output normalization**: service returns DTOs with safe defaults

## Error Handling Strategy (Domain -> HTTP)

### Domain Errors

تعريف فئات أخطاء ثابتة:

- `ValidationError`
- `AuthorizationError`
- `NotFoundError`
- `ConflictError` (e.g. invalid status transition)
- `DatabaseError` (wrapped, no leaking internals)
- `UnexpectedError` (catch-all)

كل Domain Error يحمل:

- `code` (stable string)
- `message` (user-safe)
- optional `details`

### Error Mapper

`server/shared/error/ErrorMapper.ts` يقوم بـ:

- تحويل Domain Error إلى:
  - HTTP status code
  - `statusMessage`
  - response body ثابت format

يمنع:

- 500 غير مفهوم بدون سبب
- SSR crash due to unknown response shape

## Observability (Required for Debugging)

أضف:

- structured logging في `server/shared/logging/logger.ts`
- correlation id في request headers/context
- log level rules:
  - warn: policy rejects
  - error: exceptions
  - debug: extra payload details in local env

## SSR Stability Rules for Backend

لتجنب مشاكل IPC/500 على pages:

- كل API endpoint:
  - يرد JSON consistent
  - في حالة فشل:
    - response error body ثابت
    - لا يترك handler ينهار بدون catch

- Domain services:
  - wrap Prisma errors
  - ensure status transitions use safe enum references

## Deliverable: Next Phase

الملف القادم `05-frontend-architecture.md` يحدد كيف تتحول هذه الـ DTOs إلى view models آمنة في UI:
- safe rendering
- SSR boundaries
- Pinia module strategy
