# Backend API Technical Analysis Report

Project stack: `Nuxt 4 + Nitro + Prisma + PostgreSQL`  
Scope: Admin backend APIs, auth/permission flow, Prisma query behavior, error handling, and operational reliability.

---

# Backend Issues Report

## Scope and Evidence

Reviewed endpoints:
- `DELETE /api/admin/products/:id` -> `server/api/admin/products/[id].delete.ts`
- `GET /api/admin/dashboard` -> `server/api/admin/dashboard.get.ts`
- `GET /api/admin/orders` -> `server/api/admin/orders/index.get.ts`
- `GET /api/admin/users` -> `server/api/admin/users/index.get.ts`

Reviewed supporting backend pieces:
- Auth middleware: `server/middleware/auth.ts`
- Permission/admin checks: `server/utils/admin.ts`, `server/utils/permissions.ts`
- Dashboard service/caching: `server/domains/admin/services/AdminDashboardService.ts`
- Shared logging: `server/utils/logger.ts`
- Data model: `prisma/schema.prisma`
- Frontend delete flow (to confirm duplicate/race behavior): `app/pages/admin/index.vue`, `app/composables/useApiFetch.ts`

Observed runtime log evidence:
- In terminal logs (`terminals/2.txt`), app start fails before API server launch due to PostgreSQL bind conflict:
  - `Bind for 0.0.0.0:5432 failed: port is already allocated`
- This means local endpoint logs can be incomplete unless DB/container startup issue is resolved first.

## Issue: Permanent Delete Returns 404 (Idempotency/Race Semantics)
Severity: `High`

Root Cause:
- The endpoint checks product existence, then deletes. On duplicated delete requests, the second request naturally hits "not found" and returns `404`.
- Frontend already has guards (`deletingProducts`) but still handles `404` as "already deleted", which confirms duplicate/race requests still occur in real interaction paths.
- Current API contract is not idempotent for permanent delete. For destructive admin actions, idempotent behavior is safer.

Affected Files:
- `server/api/admin/products/[id].delete.ts`
- `app/pages/admin/index.vue`
- `app/composables/useApiFetch.ts`

Impact:
- Intermittent `404 Product not found` after successful delete.
- Ambiguous UX and noisy error logs.
- Increased support/debugging cost for "false-failure" incidents.

Technical Notes:
- This is **not only** a Prisma where-clause bug. Query currently uses `findFirst({ where: { id } })`, which is valid for both active and soft-deleted records.
- Main issue is duplicate requests + non-idempotent delete response semantics.

## Issue: Soft Delete / Permanent Delete Contract Is Underspecified
Severity: `High`

Root Cause:
- `DELETE /api/admin/products/:id` has two behaviors (`archive` vs `permanent=true`) in one endpoint.
- Behavior is implicit through query string and not enforced through strict API-level state machine.
- No server-side guard against invalid transitions (example: permanent delete request retried after successful delete).

Affected Files:
- `server/api/admin/products/[id].delete.ts`
- `server/api/admin/products/[id]/restore.patch.ts`
- `prisma/schema.prisma`

Impact:
- Inconsistent operational semantics during retries.
- Harder observability because one route does two different destructive operations.
- Increased risk of race-condition side effects with concurrent actions.

## Issue: Products Listing API Ignores `showArchived` Filter
Severity: `High`

Root Cause:
- `GET /api/admin/products` reads `showArchived` from query but does not use it in service call.
- Frontend toggles archive view and refreshes, but backend call currently does not apply that filter.

Affected Files:
- `server/api/admin/products/index.get.ts`
- `app/pages/admin/index.vue`
- `server/domains/catalog/services/ProductsService.ts` (service contract likely needs archived mode)

Impact:
- UI state can diverge from DB/filter state after delete/restore.
- Operator may think product still exists or has not moved states.
- This directly amplifies confusion around delete flow and subsequent 404s.

## Issue: `GET /api/admin/users` Pagination Metadata Is Incorrect
Severity: `High`

Root Cause:
- Endpoint returns `total: users.length` (current page size), not total DB count.
- No `totalPages`, no `limit` in response.

Affected Files:
- `server/api/admin/users/index.get.ts`

Impact:
- Broken pagination logic in admin UI.
- Missing/incorrect navigation for larger datasets.
- Inconsistent response schema compared to other endpoints.

## Issue: Response Shape Inconsistency Across Admin Endpoints
Severity: `Medium`

Root Cause:
- Different contracts:
  - Products: `{ success, items, total, page, limit }`
  - Orders: `{ items, total, page, totalPages }`
  - Users: `{ success, users, total }`
  - Dashboard: raw object from service
- This creates frontend normalization hacks and brittle type assumptions.

Affected Files:
- `server/api/admin/products/index.get.ts`
- `server/api/admin/orders/index.get.ts`
- `server/api/admin/users/index.get.ts`
- `server/api/admin/dashboard.get.ts`
- `app/composables/useApiFetch.ts`

Impact:
- Error-prone frontend state mapping.
- Higher chance of integration bugs after endpoint changes.

## Issue: Dashboard Cache Invalidation Gaps
Severity: `Medium`

Root Cause:
- Dashboard endpoint uses `adminDashboardService` cache.
- Mutating endpoints (product delete/restore/order/user mutations) do not consistently call dashboard cache invalidation methods.

Affected Files:
- `server/domains/admin/services/AdminDashboardService.ts`
- `server/api/admin/products/[id].delete.ts`
- `server/api/admin/products/[id]/restore.patch.ts`
- Other mutation routes touching metrics (`orders`, `users`)

Impact:
- Dashboard may show stale counts/revenue/low-stock until TTL expiration.
- Operational decisions may use outdated data.

## Issue: Permission Model Too Broad for Destructive Actions
Severity: `Medium`

Root Cause:
- `requireAdmin` allows roles `ADMIN`, `SUPER_ADMIN`, `SALES`, `MANAGER` on all routes where used.
- Product hard delete endpoint relies only on `requireAdmin` and does not require explicit permission-level checks.

Affected Files:
- `server/utils/admin.ts`
- `server/api/admin/products/[id].delete.ts`
- `server/utils/permissions.ts` (available but not used consistently)

Impact:
- Potential over-privilege for destructive operations.
- Security risk if staff roles are not intended to permanently delete catalog data.

## Issue: Error Handling and Logging Are Not Standardized
Severity: `Medium`

Root Cause:
- Mixed use of `console.log`, `console.error`, and partial `logger`.
- No structured correlation fields (requestId, endpoint, actor, resource state).
- Endpoint error payload conventions vary (`message` vs `statusMessage`).

Affected Files:
- `server/api/admin/products/[id].delete.ts`
- `server/api/admin/orders/index.get.ts`
- `server/api/admin/users/index.get.ts`
- `server/api/admin/dashboard.get.ts`
- `server/utils/logger.ts`

Impact:
- Harder production debugging and incident reconstruction.
- Low-quality observability for race-condition and retry issues.

## Issue: Startup Reliability Blocker Masks Backend Diagnostics
Severity: `Critical`

Root Cause:
- Docker PostgreSQL container fails to start because host port `5432` is already allocated.

Affected Files:
- `docker-compose.yml`
- Local runtime environment / Docker daemon state

Impact:
- API server not fully available in local dev.
- Cannot produce complete endpoint runtime traces until startup blocker is fixed.

---

# Backend Fix Plan

## Phase 1: Fix Deletion Reliability (Highest Priority)

Objective:
- Eliminate false `404` in permanent delete workflow and make delete contract idempotent.

Files to Modify:
- `server/api/admin/products/[id].delete.ts`
- `app/pages/admin/index.vue`
- `app/composables/useApiFetch.ts`

Required Changes:
- Make permanent delete idempotent:
  - If product missing and `permanent=true`, return success with `alreadyDeleted: true` instead of hard 404 for retried deletes.
- Add server-side idempotency key support for destructive operations (`x-idempotency-key`) with short TTL cache.
- Keep frontend button guard, but rely on backend as source of truth.
- Add request deduplication for mutations in `$apiFetch` for same method+url+payload within a short in-flight window.

Expected Result:
- No user-visible delete failures from duplicate requests.
- Stable behavior under retries and race conditions.
- Cleaner logs and lower support overhead.

Example patch direction:
```ts
if (permanent) {
  const deleted = await prisma.product.deleteMany({ where: { id } })
  return {
    success: true,
    message: deleted.count ? 'Product permanently deleted' : 'Product already deleted',
    alreadyDeleted: deleted.count === 0
  }
}
```

## Phase 2: Correct API State Management and Data Contracts

Objective:
- Align backend responses with frontend expectations and prevent state drift.

Files to Modify:
- `server/api/admin/products/index.get.ts`
- `server/domains/catalog/services/ProductsService.ts`
- `server/api/admin/users/index.get.ts`
- `server/api/admin/orders/index.get.ts`
- `server/api/admin/dashboard.get.ts`

Required Changes:
- Implement archived filtering from `showArchived` in products listing path.
- Fix users pagination metadata using `count()` with same `where`.
- Unify list response format across admin endpoints:
  - `success`, `items`, `total`, `page`, `limit`, `totalPages`.
- Wrap dashboard response consistently:
  - `{ success: true, data: ... }`.

Expected Result:
- Predictable frontend behavior after archive/restore/delete.
- Correct pagination for users/orders/products.
- Reduced frontend normalization complexity.

## Phase 3: Standardize Error Handling and Observability

Objective:
- Produce consistent, actionable error responses and structured logs.

Files to Modify:
- `server/utils/logger.ts`
- `server/api/admin/products/[id].delete.ts`
- `server/api/admin/dashboard.get.ts`
- `server/api/admin/orders/index.get.ts`
- `server/api/admin/users/index.get.ts`
- Shared error mapper utility (where applicable)

Required Changes:
- Enforce unified error payload shape:
  - `statusCode`, `statusMessage`, optional `code`.
- Replace ad-hoc console logging with structured logger fields:
  - `requestId`, `route`, `userId`, `action`, `resourceId`, `result`.
- Add info/warn logs for duplicate delete handling path.
- Integrate startup diagnostics for DB connection and port conflicts.

Expected Result:
- Faster root-cause analysis in production.
- Lower MTTR for API incidents.
- Better confidence in monitoring and alerting.

## Phase 4: Architecture and Performance Hardening

Objective:
- Prevent stale dashboard data, tighten permissions, and improve transactional safety.

Files to Modify:
- `server/domains/admin/services/AdminDashboardService.ts`
- Mutation routes for products/orders/users/categories
- `server/utils/admin.ts`
- Routes currently using only `requireAdmin`

Required Changes:
- Call dashboard cache invalidation after relevant mutations.
- Enforce permission-based checks (`requirePermission`) for destructive actions.
- Use transactions for multi-step side effects (DB write + audit + cache invalidation orchestration strategy).
- Add mutation rate limiting/throttling on destructive admin endpoints.

Expected Result:
- Accurate dashboard metrics after writes.
- Stronger least-privilege security model.
- Safer and more resilient write paths.

---

# Recommended Improvements

## 1) Prevent Duplicate Requests
- Add in-flight dedup map in `$apiFetch`.
- Add idempotency key support server-side for DELETE/PATCH/POST critical routes.
- Return deterministic response for retried operations.

## 2) Improve Transaction Safety
- Use `prisma.$transaction` for operations that combine multiple writes or write + dependent side effects.
- Prefer `deleteMany` for idempotent hard delete paths.
- Ensure rollback-safe sequence for related writes.

## 3) Add Structured Logging
- Emit JSON logs with stable fields (`timestamp`, `level`, `route`, `requestId`, `userId`, `resourceId`, `errorCode`).
- Remove noisy free-form `console.log` statements from production paths.
- Add explicit log event for "duplicate delete request handled idempotently".

## 4) Improve API Responses
- Standardize envelope for all admin endpoints.
- Include pagination metadata everywhere lists are returned.
- Include machine-readable error codes for frontend handling.

## 5) Improve Middleware Validation
- Add schema validation (Zod/Valibot) for query/body/params.
- Validate `id` format, pagination bounds, and enum filters.
- Reject malformed inputs early with clear 400 responses.

## 6) Improve Soft Delete Architecture
- Separate archive and permanent delete into explicit endpoints:
  - `PATCH /api/admin/products/:id/archive`
  - `DELETE /api/admin/products/:id`
- Document state transitions: `active -> archived -> permanently_deleted`.
- Ensure list endpoints explicitly choose include/exclude archived records.

---

## Immediate Action Checklist (Execution Order)

1. Resolve local DB startup conflict (`5432`) to enable full backend runtime validation.
2. Apply Phase 1 delete idempotency changes.
3. Fix products archive filter + users pagination total.
4. Standardize response envelope for the 4 reviewed endpoints.
5. Add structured logging + dashboard cache invalidation hooks.

---

## Additional Notes About the `404 Product not found` Problem

Based on current code and frontend flow, the issue is a combined reliability problem:
- Duplicate/retried delete requests: **Yes, likely present**.
- Soft delete/permanent delete logic conflict: **Partially** (single endpoint with dual behavior causes ambiguity).
- Wrong Prisma where clause: **Not primary now** (current check is acceptable).
- Frontend state not updated: **Partially mitigated**, but backend contract inconsistency still causes confusion.
- Race conditions: **Yes**, especially under rapid UI interactions or retries.

Final diagnosis:
- The highest-value fix is idempotent permanent delete semantics plus strict state contract and response normalization.

