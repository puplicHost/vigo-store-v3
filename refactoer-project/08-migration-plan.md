# 08-Migration-Plan.md

## Migration Philosophy

الهدف ليس “rewrite everything at once”، بل:

- Refactor incrementally
- Keep endpoints stable
- Maintain SSR stability at كل خطوة
- Ensure no hidden breaking changes to admin/store UI contracts

## Phased Order of Operations (Step-by-step)

### Phase 0: Foundation Setup (No behavioral changes)

1. Create `server/domains/*` skeleton with empty services/repositories.
2. Create `shared/dto`, `shared/validators`, `server/shared/error` scaffolding.
3. Add error mapper + consistent response format contract.
4. Add correlation id logging in middleware.

Result:

- مشروع “جاهز” لنقل منطق تدريجيًا دون كسر SSR.

### Phase 1: Contract-first Migration (DTOs + ViewModels)

1. Identify the most unstable path: `admin/dashboard`.
2. Define DTOs for:
   - dashboard stats
   - recent orders
   - low stock products
3. Define ViewModel mapping rules on frontend:
   - safe id formatting
   - safe number formatting
   - enums fallback `UNKNOWN`

Result:

- حتى لو API return shape changes قليلاً، templates لن تنهار.

### Phase 2: Backend Service/Repository Extraction (Route by Route)

مهاجرة route by route مع adapter رقيق:

1. Migrate `GET /api/settings`
   - simplest endpoint
   - verify end-to-end stability
2. Migrate `GET /api/admin/products` and `GET /api/admin/categories`
   - ensure pagination bounds and stable selection fields
3. Migrate `GET /api/admin/orders` (listing)
   - ensure DTO shape used by dashboard orders table
4. Migrate `PATCH /api/admin/orders/[id]` (status update)
   - service enforces allowed transitions
5. Migrate `GET/POST /api/auth/*`
   - fix auth errors and ensure policy middleware ordering

Result:

- business logic ينتقل إلى services/repositories تدريجيًا.

### Phase 3: AdminDashboardService + Aggregation Optimization

1. Create `AdminDashboardService` to compute:
   - revenue / orders / users stats
   - recent orders list (always safe and normalized)
2. Make dashboard endpoint return a single aggregated DTO:
   - reduce SSR fetch waterfall
3. Frontend uses only this aggregated DTO for dashboard render.

Result:

- تقليل points of failure على SSR dashboard.

### Phase 4: Security Hardening + RBAC Consolidation

1. Implement RBAC engine in a single place (server domain).
2. Ensure middleware reads policies from endpoint metadata.
3. Add audit log insertion for every admin mutation.
4. Confirm rate limiting for auth + sensitive endpoints.

Result:

- حماية enterprise-ready + auditing.

### Phase 5: Performance & Scaling Features

1. Introduce caching provider interface (Redis-ready).
2. Cache settings & catalog read endpoints.
3. Add background jobs system for exports/seed/email.
4. DB indexes audit with explain plans.

Result:

- تحسين latency وتقليل DB load.

## Safe Refactor Strategy (How to avoid breaking SSR)

### 1) Dual-run contract validation (Recommended)

- لفترة قصيرة:
  - keep old handler
  - run new service path in background (or toggle)
  - compare DTO shapes in logs

### 2) Feature Flags

- استخدم env flags لتبديل المسار:
  - `USE_NEW_ADMIN_DASHBOARD_SERVICE=true`

### 3) Error Boundary Contract

- أي error يجب أن:
  - returns stable JSON
  - frontend shows error UI instead of crashing

## Risk Mitigation Plan

أهم المخاطر:

- SSR crash due to data shape mismatch
- middleware ordering causing redirect loops
- DB constraints causing 500 on admin deletes/updates
- caching invalidation bugs

Mitigations:

- DTO/ViewModel mapping with safe defaults
- route adapter tests
- integration tests for admin workflows
- audit logging verifying actions

## Definition of Done for Migration

- `/admin/dashboard` opens without 500 under refresh + HMR edits.
- all admin API routes:
  - return consistent shapes
  - handle errors gracefully
- auth routes:
  - no ReferenceError/undefined runtime crashes
- no unhandled rejections affecting Nitro workers

## Next Deliverable

الملف القادم `09-tech-stack-final.md` يحدد نسخة stable مؤكدة للـ stack قبل البدء بالcoding الفعلي.
