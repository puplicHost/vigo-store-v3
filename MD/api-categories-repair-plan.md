# MD/api-categories-repair-plan.md

## Context

The production goal is to permanently eliminate:

- `GET /api/admin/categories` → **500 Internal Server Error**
- Frontend symptoms:
  - `Failed to fetch categories`
  - `useApiFetch.ts:30` `FetchError` / `H3Error` wrapped response
  - i18n warnings are present but **not** the root cause (cleanup only)

This roadmap is phase-based and execution-oriented. It provides inspection steps, repair tasks, and verification criteria. It **does not implement code changes**.

---

# 1. API Route Repair Plan

## Repair Objective

Ensure `/api/admin/categories` returns a deterministic, contract-stable JSON response (200/4xx/5xx) with no unhandled exceptions, and that auth/RBAC errors are returned as explicit 401/403 (not 500).

## Suspected Issues

1. Handler structure problems
   - Wrong export style (`export default` vs named export) after refactor
   - Multiple exports or file moved without Nuxt recognizing route
2. Async logic errors
   - Missing `await` on Prisma/service methods
   - Promise rejection not caught (async handler throws raw error → 500)
3. Response format mismatch
   - Returning raw Prisma entities with unexpected fields
   - Returning `undefined` on empty data (frontend mapping fails later; but endpoint still returns 200—check anyway)
4. Middleware/auth issues
   - `auth` middleware failing with undefined `JWT_SECRET` or broken decode path
   - RBAC guard causing unexpected exception instead of controlled `navigateTo`/HTTP error
   - Maintenance middleware letting route through but service throws
5. Error mapper swallowing details
   - Error mapper converts everything into generic 500, hiding the true root cause in dev logs

## Repair Tasks (Execution Steps)

### Task A: Confirm the endpoint actually hits the expected handler

1. Add a temporary log at the very beginning of `server/api/admin/categories.get.ts` (or the current categories route file).
2. Confirm the log appears for:
   - Direct browser/Postman request
   - Real frontend request (Categories page)

**Outcome:** Establish a correlation between request and handler file.

### Task B: Validate exports and routing

1. Verify the route file name and path map to `/api/admin/categories`.
2. Confirm the handler is `export default defineEventHandler(async (event) => { ... })`.
3. Ensure the route path does not conflict with another route (e.g., duplicate file / directory mismatch).

**Outcome:** Eliminate “route not found / wrong handler” classes of 500.

### Task C: Enforce deterministic response contract

Define (and document) the required response shape for the frontend categories list page, for example:

- `200` response:
  - `{ items: CategoryDTO[], total?: number }` (or whatever the frontend expects)
- `401/403` response:
  - `{ errorCode, statusMessage }` (no stack traces)
- `500` response:
  - stable JSON error format (still with details only in dev logs)

Then verify the handler always returns one of these formats.

**Outcome:** Prevent “frontend sees H3Error wrapper only” ambiguity.

### Task D: Audit middleware integration

1. Determine whether the categories endpoint is protected by:
   - route middleware in `definePageMeta` (frontend)
   - or server middleware in `server/middleware/*`
2. Inspect the auth/RBAC middlewares and confirm:
   - they do not throw on missing token
   - they do not throw on malformed JWT
   - they return controlled HTTP codes

**Outcome:** Ensure policy/auth failures never turn into 500.

## Success Criteria

1. `GET /api/admin/categories` responds with:
   - `200` when auth is valid
   - `401/403` when auth is missing/invalid/unauthorized
2. No unhandled exception in server logs for this endpoint.
3. Response JSON shape matches frontend contract (no parsing/mapping failures).

---

# 2. Database Access Repair Plan

## Repair Objective

Ensure Prisma/DB operations used by categories endpoint:
- succeed reliably (or fail with controlled domain errors),
- never return null/undefined where DTO mapping expects arrays,
- never trigger constraint/migration/runtime failures that manifest as generic 500.

## Suspected Issues

1. Prisma query failure
   - missing migrations
   - broken schema relation
   - DB connection issues
2. Null or missing relations
   - categories include fields that might be null but DTO assumes non-null
3. Missing awaits / promise handling
   - `.findMany()` returns a promise that is passed onward
4. Environment mismatch
   - `DATABASE_URL` invalid in dev environment running the request
   - Prisma client initialization error
5. Pagination/filter query bug
   - invalid `take/skip/orderBy` causing query rejection

## Repair Tasks (Execution Steps)

### Task A: Verify Prisma connectivity independently

1. Call `/api/settings` (already known to work in your previous diagnostics if applicable) to confirm DB connectivity for that handler.
2. Call `/api/admin/categories` directly in Postman with valid auth to confirm the DB-dependent part fails.

**Outcome:** Differentiate DB-level failure vs handler-level failure.

### Task B: Inspect repository query behavior

In `server/domains/catalog/repositories/CategoryRepository.ts` (or equivalent categories repository):

1. Confirm the method used by the categories API:
   - exists
   - is called with the intended parameters
2. Validate:
   - `findMany` query has safe defaults
   - no undefined filter fields are passed to Prisma
   - `select` fields align with DTO
3. Ensure the repository method always returns an array:
   - `[]` for empty results (never `null`)

**Outcome:** Remove shape/return-type ambiguities.

### Task C: Validate migrations and Prisma generate state

1. Confirm `prisma/schema.prisma` matches the deployed DB schema.
2. Confirm `prisma generate` has been run after schema changes.
3. If using Docker, confirm the app container uses the same DB version/migrations.

**Outcome:** Prevent initialization/query exceptions.

### Task D: Add domain-level query error mapping (plan only)

Ensure DB errors propagate into:
- a domain error type
- mapped by `ErrorMapper` into stable JSON and logs the root cause server-side.

**Outcome:** Avoid hiding Prisma errors behind generic 500.

## Success Criteria

1. Repository method returns an array reliably.
2. Direct call to `/api/admin/categories` produces:
   - `200` for valid auth
   - controlled error response for DB failures (not empty HTML / unparseable)
3. No Prisma initialization/query stack trace reaches the client.

---

# 3. Fetch Layer Repair Plan

## Repair Objective

Ensure the frontend fetch layer (`useApiFetch.ts`) correctly:
- attaches auth headers/cookies
- propagates HTTP errors without obscuring server details
- behaves consistently during SSR + client hydration

## Suspected Issues

1. Auth header/cookie mismatch
   - missing `Authorization: Bearer ...` header when required
   - cookie not included (`credentials`/`credentials: include` mismatch)
2. useFetch configuration issues
   - wrong `key` causing deduplication bugs or stale state
   - transform returning wrong shape on error paths
3. Error propagation hides server response
   - frontend only shows `500 Failed to fetch categories` but not the actual server error body/code
4. SSR/client double calls
   - categories endpoint called twice with one call missing auth → 500
5. H3 error wrapper confusion
   - frontend logs show H3Error wrapper, but true error is in response payload

## Repair Tasks (Execution Steps)

### Task A: Confirm request configuration on both SSR and client

1. Inspect `useApiFetch.ts` behavior:
   - verify `credentials: include` (or equivalent)
   - verify the `Authorization` header is set when token exists
2. Log (temporarily):
   - request URL
   - headers presence (do not log secrets)
   - whether auth token value exists at call time

**Outcome:** Determine if 500 is caused by missing auth or request misconfiguration.

### Task B: Ensure error response body is available to UI/devtools

1. Verify whether `useApiFetch` currently:
   - returns the server error payload (if any)
   - or replaces it with generic error message
2. Update diagnostics strategy (plan only):
   - capture server response body in dev logs
   - map it to `statusCode`, `errorCode`, `statusMessage`

**Outcome:** Get actionable info rather than only `H3Error: 500 Failed to fetch categories`.

### Task C: Prevent SSR double-call race conditions

1. Determine if the Categories page fetch runs in both:
   - SSR
   - client hydration
2. If SSR fails but client retries incorrectly, add a verification step:
   - count network calls
   - compare request headers/cookies between calls

**Outcome:** Remove timing-dependent failure patterns.

## Success Criteria

1. When calling `/api/admin/categories` with the same auth context used by the browser, the endpoint response is stable.
2. `useApiFetch` logs show:
   - status code
   - server error code/message (if returned)
   - no unhandled promise rejections
3. No duplicate failing calls pattern (or it is handled gracefully).

---

# 4. UI Integration Repair Plan

## Repair Objective

Make `pages/admin/categories/index.vue` resilient:
- no crashes when categories are temporarily unavailable
- clear loading/error states
- null-safe rendering
- consistent user experience during SSR/CSR transitions

## Suspected Issues

1. UI assumes successful payload shape
   - render tries to access `items.length` or map over undefined
2. Missing loading state coordination
   - UI renders before API returns
3. Error state not handled
   - error thrown during SSR causes 500/IPC symptom in dev (if UI triggers exceptions)
4. i18n missing keys spam obscures debugging
   - not root cause but noise

## Repair Tasks (Execution Steps)

### Task A: Validate async data handling

1. Inspect how the page loads categories:
   - `useApiFetch` usage
   - `useAsyncData` or computed mapping
2. Confirm the page uses:
   - `pending/loading` to render skeleton/loading
   - `error` to render an error boundary or empty state

### Task B: Ensure null-safe rendering

1. Confirm all template usage:
   - treats categories list as `[]` on failure
   - uses fallback for missing fields
2. Confirm no direct property access on undefined:
   - e.g. `category.id.slice(...)` without checking type

### Task C: Reconcile SSR behavior

1. Ensure the UI does not throw during SSR when:
   - auth is missing
   - endpoint temporarily returns error
2. Validate that SSR output does not crash:
   - any SSR exception will cause `500` symptoms to appear to the client.

### Task D: Add graceful retry strategy (plan only)

1. Provide UI retry button that:
   - triggers `refresh`/re-fetch only after auth is confirmed
2. Avoid repeated fetch loops.

## Success Criteria

1. Categories page renders:
   - loading state while fetching
   - error state with retry if API fails
   - correct list UI when API returns 200
2. No console/server 500s originating from UI exceptions.

---

# 5. Error Handling Hardening Plan

## Repair Objective

Transform error handling into a consistent, structured, debuggable system:
- server returns stable JSON error contracts
- frontend shows meaningful message without exposing secrets
- server logs always contain root stack trace

## Hardening Tasks

### Task A: Standardize domain errors and mapping

1. Enforce that all domain/services throw or return domain errors of known types.
2. Ensure `ErrorMapper`:
   - logs the original error (with stack) in server logs
   - returns stable response body with:
     - `errorCode`
     - `statusMessage`
     - `statusCode`
     - optional `details` only in dev

### Task B: Improve server-side try/catch policy

1. Ensure every API handler has:
   - a try/catch boundary (or a global wrapper) that maps errors to stable responses
2. Prevent “throw raw error” that results in unstructured 500.

### Task C: Frontend fallback states

1. UI must never assume success:
   - if `error` exists, show a retryable UI
   - if data missing, use safe defaults

### Task D: Debug logging strategy

Use a strict debug flag:

- In dev only:
  - log request ids
  - log service method start/end
  - log repository query counts (not payload secrets)
- In prod:
  - keep logs minimal but structured

## Success Criteria

1. Every failure of `/api/admin/categories` yields:
   - clear server logs with the actual root cause
   - client receives structured JSON error
2. Frontend no longer shows only generic:
   - `500 Failed to fetch categories`
   - but rather error code/message.

---

# 6. Final Verification Checklist

Perform these checks after each phase and again at the end.

## Endpoint Verification

- [ ] Direct request to `GET /api/admin/categories` returns `200` with valid auth
- [ ] Direct request without auth returns `401/403` (never `500`)
- [ ] Response JSON shape matches frontend contract
- [ ] No unhandled exceptions appear in Nuxt/Nitro logs

## UI Verification

- [ ] Categories page renders correctly after hard refresh and navigation
- [ ] No console `500` errors remain
- [ ] No unhandled promise errors in browser console
- [ ] Loading state appears during fetch; error state appears on failure
- [ ] i18n missing keys are cleaned up (noise reduction only)

## Stability Verification

- [ ] Refresh + HMR edits do not reintroduce the 500
- [ ] SSR + CSR hydration does not trigger failing duplicate requests
- [ ] Error boundaries keep the page functional even when endpoint fails temporarily

## Definition of Done

The issue is considered fully resolved when:

- `/api/admin/categories` never returns 500 under supported auth scenarios
- failures degrade gracefully with controlled error responses
- both server logs and frontend UI provide actionable error details
