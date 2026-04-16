# Phase 04: Data Tables and Forms

## Objective of the Phase
Increase speed and reliability on high-frequency admin tasks by standardizing data tables, filters, actions, and form composition. This phase focuses on the operational core of the admin panel where users manage products, categories, orders, users, and settings.

## Problems Being Solved
- Table implementations vary between pages, reducing predictability for sorting, filtering, row scanning, and action discovery.
- Search and filters exist, but toolbar structure and control priority are inconsistent.
- Bulk actions are either absent or visually underemphasized in data-heavy workflows.
- Modal forms and dedicated edit forms do not follow one shared grouping model.
- Labels, helper text, and validation messaging are not standardized across page-level forms.
- Dense management screens feel functional, but not yet optimized for fast daily administration.

## Detailed Improvement Tasks

### 1. Improve Table Readability
- Standardize table anatomy: header row, row height, column alignment, status treatment, action cell behavior, and empty-state handling.
- Define rules for truncation, secondary metadata, badges, and date/amount formatting.
- Improve row scanability through contrast, zebra alternatives if needed, hover behavior, and stronger column hierarchy.
- Introduce a responsive degradation strategy for dense tables rather than forcing every column to remain visible.

### 2. Improve Filters and Search UX
- Standardize toolbar composition so search, filter controls, active filters, and primary actions always appear in predictable positions.
- Create filter models for simple status filtering, multi-filter combinations, and range/date filters.
- Add clear reset behavior and visible filter state summaries.
- Ensure search is contextual and does not compete with unrelated global search behavior.

### 3. Improve Bulk Actions Visibility
- Define when row selection is justified for products, categories, orders, and users.
- Standardize selection count, bulk-action bar appearance, destructive-action confirmation, and post-action feedback.
- Prevent destructive actions from appearing visually equivalent to safe actions.

### 4. Improve Form Grouping
- Organize forms into logical sections such as basic information, status/configuration, metadata, and action footer.
- Use section headings and helper copy only where they reduce ambiguity.
- Standardize modal form length limits and define when a full-page form is more appropriate than a modal.

### 5. Improve Labels and Help Text
- Define concise label-writing rules for operational fields.
- Use helper text to explain consequences, validation rules, and system behavior only when needed.
- Ensure placeholder text never replaces required labels.

### 6. Improve Validation Feedback
- Standardize inline field errors, section-level validation summaries, submit-state blocking, and recovery guidance.
- Ensure invalid fields are visually and semantically distinguishable.
- Define error timing for blur, submit, and async validation scenarios.

## Affected Pages/Components
- `app/components/admin/AdminTable.vue`
- `app/components/admin/AdminModal.vue`
- `app/components/admin/StatusBadge.vue`
- `app/components/admin/EmptyState.vue`
- `app/pages/admin/index.vue`
- `app/pages/admin/categories/index.vue`
- `app/pages/admin/orders/index.vue`
- `app/pages/admin/users/index.vue`
- `app/pages/admin/settings/index.vue`
- `app/pages/admin/products/[id]/edit.vue`
- `app/pages/admin/categories/[id]/edit.vue`
- `app/composables/useSearch.ts`

## Expected UI/UX Result
- Administrators can scan records, apply filters, and complete CRUD tasks with less hesitation.
- Data management views feel cohesive across product, category, order, and user workflows.
- Forms become easier to complete correctly on the first attempt.
- Shared patterns reduce implementation drift and simplify onboarding for future contributors.

## Priority Level
Critical

## Suggested Implementation Order
1. Define the standard table and toolbar pattern for all management screens.
2. Standardize selection, row actions, and status presentation.
3. Align modal forms and full-page edit forms around one grouping system.
4. Add shared label, helper text, and validation rules.
5. Apply the pattern across products, categories, orders, users, and settings flows.
