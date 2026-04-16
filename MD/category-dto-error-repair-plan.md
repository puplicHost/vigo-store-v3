# 1. Root Cause Analysis Plan (Undefined `createdAt` / `updatedAt`)

## Objective

Identify precisely **why** `category.createdAt` and/or `category.updatedAt` are `undefined` at the point where `CategoryRepository` converts raw records into DTOs, causing:

```ts
createdAt: category.createdAt.toISOString(),
updatedAt: category.updatedAt.toISOString()
```

to throw `Cannot read properties of undefined (reading 'toISOString')`.

## Inspection Tasks

1. **Locate `toCategoryDTO` usage context**
   - Open `server/domains/catalog/repositories/CategoryRepository.ts`.
   - Find `toCategoryDTO` and all call sites (e.g. `listCategories`, `findById`).
   - Confirm which query method is invoked by `GET /api/admin/categories`.

2. **Add temporary logging before DTO mapping**
   - Immediately before calling `toCategoryDTO`, add a log of the raw record:
     - `console.log('[CategoryRepository] raw category record', { id: category.id, createdAt: category.createdAt, updatedAt: category.updatedAt })`.
   - Ensure logs include:
     - type information (`typeof category.createdAt`)
     - raw values (or `null/undefined`).

3. **Inspect server logs while hitting the endpoint**
   - Run `npm run dev`.
   - Directly call `GET /api/admin/categories` via browser/Postman.
   - Observe logged raw categories in terminal:
     - Are `createdAt`/`updatedAt` missing on some records?
     - Are they `null`, `undefined`, or already strings?

4. **Check DTO mapping input assumptions**
   - Inspect `toCategoryDTO` signature:
     - What type is assumed for `category.createdAt` / `updatedAt`?
     - Is the type `Date`, `string`, or `any`?
   - Confirm that this assumption matches what Prisma returns for the query.

## Repair Tasks (Planning Only)

1. Document which of the following is true:
   - A) Some DB rows are missing `createdAt` / `updatedAt`.
   - B) Prisma select omits those fields (not included in query).
   - C) Additional transformation layer overwrites these fields with `undefined` or wrong type.
2. Based on the evidence:
   - Decide whether the primary fix is at:
     - the DB level (ensuring timestamps always exist),
     - the query/selection level (ensuring fields are selected),
     - or the mapping level (ensuring safe handling when fields are unexpectedly null).

## Success Criteria

- A clear, evidence-backed statement exists describing **exactly** why `createdAt`/`updatedAt` are undefined:
  - e.g. “Legacy category rows created before timestamps were added have `createdAt = null`”, or
  - “The repository query uses a `select` that excludes timestamp fields.”
- Logs show which categories (by `id`) are problematic and their raw values for both fields.

---

# 2. Repository Mapping Repair Plan (`toCategoryDTO`)

## Objective

Make `CategoryRepository.toCategoryDTO()` robust so that:
- It never calls `.toISOString()` on undefined/null.
- It enforces DTO contract expectations.
- It produces safe DTOs even when source data is incomplete.

## Inspection Tasks

1. **Review `toCategoryDTO` implementation**
   - Check:
     - All fields being mapped (id, name, dates, etc.).
     - Which fields are assumed to always exist.
   - Identify assumptions such as:
     - “`createdAt` and `updatedAt` are always `Date`.”
     - “`name` is always non-null string.”

2. **Identify the expected DTO contract**
   - In `shared/dto` or equivalent, locate the Category DTO definition.
   - Confirm:
     - Are `createdAt`/`updatedAt` required or optional?
     - What type (ISO string vs. Date vs. number)?
   - Verify frontend expectations:
     - Does admin/categories page expect ISO strings?
     - Does it sort/filter by these fields?

3. **Compare DTO expectations with repository input**
   - Given the raw category data from logging (Section 1):
     - Do types match DTO contract?
     - Are there edge cases (e.g. imported test data) that violate assumptions?

## Repair Tasks (Planning Only)

1. **Introduce defensive mapping in `toCategoryDTO`**
   - Plan to:
     - Check that `category.createdAt` and `category.updatedAt` exist and are of the expected type.
     - Convert only when safe.
   - Example strategy (conceptual, not implementation):
     - If date is missing:
       - either use a safe fallback (e.g., `null` or `''` in DTO),
       - or throw a domain-level “InvalidDataError” that is caught and logged without crashing the entire list endpoint.

2. **Align DTO optionality with real-world data**
   - If old records legitimately lack timestamps:
     - mark those fields as optional in DTO,
     - or enforce migration to backfill them (see Section 3).
   - Decide which path is safer:
     - Strict enforcement (failing fast via domain error),
     - or tolerant behavior (fallback / partial DTO).

3. **Plan to add validation step inside mapping**
   - Before returning DTO:
     - Validate required fields for DTO shape.
     - If invalid, log a structured error including category id and problematic fields.

## Success Criteria

- `toCategoryDTO` logic is clearly documented:
  - which fields are required,
  - which are optional,
  - what happens when source data is malformed.
- Mapping becomes null-safe:
  - no direct `.toISOString()` on unknown type.
  - errors are converted to domain errors or logged + skipped without causing 500 for entire endpoint.

---

# 3. Database Integrity Validation Plan

## Objective

Ensure the underlying **database table** for categories is consistent with:
- Prisma schema,
- DTO expectations,
- and repository mapping assumptions for `createdAt` / `updatedAt`.

## Inspection Tasks

1. **Inspect Prisma schema**
   - Open `prisma/schema.prisma`.
   - Locate the `Category` model.
   - Confirm:
     - `createdAt` and `updatedAt` fields exist.
     - their types (`DateTime`).
     - `@default(now())` and `@updatedAt` usage.
     - `?` (optional) vs required fields.

2. **Inspect actual table structure in DB**
   - Use psql or a DB client:
     - `\d "Category"` (PostgreSQL) or equivalent.
   - Confirm that:
     - columns `createdAt`, `updatedAt` exist.
     - types are timestamp-like.
     - nullability rules match Prisma (NOT NULL vs NULL).

3. **Check for rows with missing timestamps**

   Run queries like:

   ```sql
   SELECT id, name, createdAt, updatedAt
   FROM "Category"
   WHERE createdAt IS NULL OR updatedAt IS NULL;
   ```

   - Note any rows returned and their IDs.

4. **Check for unexpected default values**
   - Inspect whether DB has:
     - inconsistent defaults,
     - zero/epoch timestamps,
     - manually inserted legacy rows.

## Repair Tasks (Planning Only)

1. **Define migration/backfill strategy**
   - If any rows are missing timestamps:
     - plan a migration to backfill:
       - set `createdAt` to earliest known event or insertion timestamp (if available),
       - set `updatedAt` to `createdAt` or a safe default.
   - Ensure Prisma schema enforces non-null timestamps going forward (if business rules allow).

2. **Align Prisma and DB nullability**
   - If Prisma marks fields as required but DB allows NULL:
     - plan to update either:
       - DB constraint (set NOT NULL + default),
       - or Prisma model (if optional is desired).

3. **Update data import/seed logic**
   - Confirm that any seeds or imports (e.g., `seed.post.ts` or CLI) always set timestamps.

## Success Criteria

- DB introspection confirms:
  - `createdAt` and `updatedAt` exist.
  - they are non-null for all existing rows (or handled by mapping).
  - new inserts always get valid timestamps.
- No category row in DB can cause undefined timestamps during repository mapping.

---

# 4. Query Layer Verification Plan

## Objective

Verify that the **repository list query** (or equivalent) for categories is returning **all fields required** by the DTO, especially:
- `id`
- `name`
- `createdAt`
- `updatedAt`

## Inspection Tasks

1. **Review repository query implementation**
   - In `CategoryRepository`, locate the list method:
     - e.g., `listCategories` or `findAll`.
   - Confirm:
     - whether `select` or `include` is used.
     - if `select` is used, does it include `createdAt` / `updatedAt`?

2. **Check for partial select statements**
   - If the query looks like:

   ```ts
   prisma.category.findMany({
     select: { id: true, name: true /* ... */ }
   })
   ```

   - Confirm that timestamps are not omitted.

3. **Trace any intermediate transforms**
   - Look for additional mapping steps before `toCategoryDTO`:
     - Are fields renamed, dropped, or mutated?

4. **Log returned query payload (before DTO mapping)**
   - Add a log (temporarily) to capture a sample of the raw query result:
     - Ensure `createdAt`/`updatedAt` are present with correct types.

## Repair Tasks (Planning Only)

1. **Adjust select/include to meet DTO requirements**
   - Plan to:
     - always include `createdAt` and `updatedAt` in queries used by DTO mapping.
   - Consider:
     - a shared `CATEGORY_BASE_SELECT` object to prevent inconsistency between methods.

2. **Ensure consistent query across all category endpoints**
   - If multiple endpoints (e.g., admin vs store) use different queries:
     - align them on a common base selection if they share the same DTO.

3. **Document query → DTO contract**
   - For maintainability:
     - document in code comments or docs which fields must always be present in query results that feed `toCategoryDTO`.

## Success Criteria

- The list query for categories returns all DTO-required fields, verified by logs.
- No query path used by `toCategoryDTO` can omit `createdAt` or `updatedAt` accidentally.

---

# 5. DTO Hardening Strategy

## Objective

Harden DTO conversion so that malformed or incomplete category data:
- does not cause API-level 500 errors,
- is surfaced as:
  - structured domain errors for debugging, or
  - gracefully downgraded UI output (e.g., missing date displayed as `-`).

## Inspection Tasks

1. **Review current DTO type definition for categories**
   - Confirm:
     - which fields are required (non-optional).
     - expected types (e.g., `createdAt: string` ISO).
   - Check whether the type definition allows `null`/`undefined`.

2. **Review current usage of DTOs on frontend**
   - Determine:
     - how `createdAt`/`updatedAt` are used (sorting, display, filters).
     - whether UI would tolerate missing values.

## Repair Tasks (Planning Only)

1. **Introduce pre-format validation**
   - Before calling `.toISOString()`:
     - check if the value is a `Date` (or parseable string).
     - if not, follow a policy:
       - Option A: throw a **DomainInvalidDataError** (caught by ErrorMapper, logged, but does not crash entire endpoint if partial data can be skipped).
       - Option B: log warning and fallback to a safe placeholder (e.g. null/empty string).

2. **Add structured error logging for malformed records**
   - When a record fails DTO mapping:
     - log:
       - category id
       - raw `createdAt`/`updatedAt` values
       - environment (dev/prod)
     - ensure this log is easy to search in production logs.

3. **Define fallback behavior for UI**
   - Decide:
     - if a malformed category should be:
       - excluded from the list,
       - or included with missing date fields (and UI handles it).

4. **Optionally, add runtime DTO validation (Zod) in dev**
   - Wrap DTO generation in a dev-only Zod validation:
     - catch contract mismatches early,
     - prevent silent drift between backend and frontend expectations.

## Success Criteria

- DTO conversion no longer throws runtime exceptions for malformed data.
- Logs capture any invalid data scenarios with enough detail to fix data, without impacting system availability.
- Frontend behavior is defined and stable when encountering missing dates.

---

# 6. API Stability Verification Checklist

## Objective

Confirm that after repository, DB, and DTO-level repairs:
- `/api/admin/categories` is stable,
- DTO mapping is resilient,
- malformed records are handled gracefully.

## Verification Tasks

1. **Unit-level verification**
   - Add (or run existing) unit tests for `toCategoryDTO`:
     - with valid `Date` fields.
     - with null/missing `createdAt`/`updatedAt` (ensuring graceful behavior).

2. **Repository-level verification**
   - Test the categories repository method directly:
     - ensure it returns DTOs or domain objects without throwing.
     - ensure all timestamps are correctly formatted or safely handled.

3. **API-level verification**
   - Run `npm run dev`.
   - Call `GET /api/admin/categories`:
     - with valid auth (admin).
     - with no auth (to confirm 401/403, not 500).
   - Check:
     - status codes.
     - response body shape.
     - absence of unhandled errors in terminal logs.

4. **Frontend-level verification**
   - Open admin categories page.
   - Confirm:
     - categories load and render correctly.
     - no runtime errors in browser console.
     - no 500 network errors for `/api/admin/categories`.

## Success Criteria

- `/api/admin/categories` consistently returns `200` with valid categories data for authorized admin.
- No occurrence of:
  - `Cannot read properties of undefined (reading 'toISOString')`
  - or similar DTO mapping errors in server logs.
- Malformed records, if they exist, are either:
  - corrected at DB level,
  - or handled gracefully at mapping level without causing endpoint failure.
