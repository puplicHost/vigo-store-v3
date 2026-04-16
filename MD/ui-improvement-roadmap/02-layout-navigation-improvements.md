# Phase 02: Layout and Navigation Improvements

## Objective of the Phase
Improve overall admin workflow efficiency by refining the navigation shell, page composition rules, and content organization patterns. This phase focuses on making the admin experience easier to scan, easier to move through, and more resilient across desktop, tablet, and mobile contexts.

## Problems Being Solved
- The shared shell in `app/layouts/admin.vue` is visually strong, but some navigation items and real routes are not fully aligned.
- Sidebar, topbar, and content hierarchy compete for attention instead of working as a coordinated navigation system.
- Page spacing is generous in some contexts and compressed in others, which affects rhythm and predictability.
- Breadcrumb usage is not consistently surfaced across the admin flow.
- Search, notifications, theme, locale, and account controls are present, but their information hierarchy can be clearer.
- Some pages read as isolated implementations instead of part of one continuous admin platform.

## Detailed Improvement Tasks

### 1. Improve Sidebar Usability
- Reorganize sidebar items into clearer functional groups such as overview, catalog, orders, users, and configuration.
- Ensure all active admin destinations are represented consistently in the primary navigation, including notifications and settings subareas where appropriate.
- Define active, hover, collapsed, and mobile states so sidebar behavior is predictable at every breakpoint.
- Add stronger section separation for primary workflows versus secondary utilities.

### 2. Refine Topbar Hierarchy
- Reduce competition between search, notifications, locale switch, theme switch, and profile identity.
- Establish a single hierarchy rule:
  - global task search first
  - system-awareness tools second
  - identity/account controls last
- Clarify spacing and alignment so the topbar feels structured rather than additive.
- Improve notification preview density and make escalation to the full notifications page more deliberate.

### 3. Standardize Page Spacing
- Define consistent header layouts for title, description, primary action, filter/action row, and content body.
- Introduce page-width rules so wide dashboards and dense tables do not share the exact same rhythm by default.
- Normalize internal section spacing between cards, toolbars, tables, and form groups.

### 4. Strengthen Breadcrumb Clarity
- Use breadcrumbs consistently on nested edit and settings flows.
- Distinguish current page, parent section, and return path behavior.
- Ensure breadcrumb placement does not compete with the page title and action bar.

### 5. Improve Navigation Responsiveness
- Refine mobile sidebar open/close behavior, backdrop treatment, and dismissal logic.
- Prioritize a fast path back to high-value admin areas on smaller screens.
- Define breakpoint-specific behavior for persistent sidebar, temporary drawer, and compact topbar interactions.

### 6. Improve Content Organization
- Introduce a standard page anatomy for management screens:
  - page header
  - toolbar/filter zone
  - summary or guidance zone when needed
  - primary content surface
- Use consistent grouping for settings pages so tabbed and dedicated settings screens feel part of the same navigation system.
- Clarify when a task should live in a modal, side panel, or dedicated page.

## Affected Pages/Components
- `app/layouts/admin.vue`
- `app/components/admin/AdminBreadcrumbs.vue`
- `app/pages/admin/dashboard/index.vue`
- `app/pages/admin/index.vue`
- `app/pages/admin/categories/index.vue`
- `app/pages/admin/orders/index.vue`
- `app/pages/admin/users/index.vue`
- `app/pages/admin/settings/index.vue`
- `app/pages/admin/settings/payment.vue`
- `app/pages/admin/notifications/index.vue`
- `app/pages/admin/products/[id]/edit.vue`
- `app/pages/admin/categories/[id]/edit.vue`

## Expected UI/UX Result
- Administrators can navigate between core workflows faster with less spatial reorientation.
- The shell feels like a coherent operating environment instead of a reusable wrapper.
- Nested and secondary pages become easier to understand through consistent breadcrumbs and page structure.
- Mobile and tablet access support practical admin usage instead of being limited to passive viewing.

## Priority Level
High

## Suggested Implementation Order
1. Finalize sidebar information architecture and route alignment.
2. Standardize topbar hierarchy and responsive behavior.
3. Define page anatomy, spacing, and breadcrumb placement rules.
4. Apply the pattern to dashboard, inventory, categories, orders, users, settings, and notifications.
5. Validate navigation continuity on desktop and mobile breakpoints.
