# Phase 06: Mobile Responsive Improvements

## Objective of the Phase
Adapt the admin experience for tablet and mobile usage by prioritizing task continuity, control accessibility, and dense-data readability. This phase ensures the admin panel remains usable beyond desktop without reducing operational clarity.

## Problems Being Solved
- The mobile sidebar in `app/layouts/admin.vue` provides basic navigation support, but page-level workflows are still primarily desktop-oriented.
- Dense tables do not yet have a standardized mobile strategy.
- Multi-field forms and modal-based flows can become difficult to scan and complete on smaller screens.
- Topbar utilities may compete for limited horizontal space at smaller breakpoints.
- Touch ergonomics and interaction targets need more deliberate sizing rules.

## Detailed Improvement Tasks

### 1. Improve Responsive Admin Layout
- Define breakpoint-specific layout rules for sidebar persistence, topbar compression, page header wrapping, and toolbar stacking.
- Ensure titles, primary actions, and filter controls remain usable without horizontal crowding.
- Introduce a responsive content-width model for dashboards, tables, and forms rather than relying on one shared page rhythm.

### 2. Improve Mobile Tables
- Define which table columns remain visible on tablet and mobile.
- Introduce alternate responsive patterns where needed:
  - horizontal scroll for wide but high-value columns
  - stacked row cards for smaller record summaries
  - expandable row details for secondary metadata
- Preserve access to status, key identifier, value, and row actions at minimum.

### 3. Improve Adaptive Forms
- Collapse multi-column forms into deliberate single-column mobile structures.
- Reorder fields to prioritize the highest-decision inputs first on smaller screens.
- Ensure validation, helper text, and action footers remain visible without excessive scrolling friction.

### 4. Improve Collapsible Sidebar Behavior
- Refine mobile drawer width, transition timing, close affordances, and focus return behavior.
- Ensure users can move between main admin sections quickly after completing an action.
- Prevent the sidebar from obscuring crucial page controls in awkward intermediate viewport widths.

### 5. Improve Touch-Friendly Controls
- Define minimum touch targets for icon buttons, row actions, segmented controls, form fields, and confirmation actions.
- Increase tolerance for touch interactions in dense control groups such as filters and topbar utilities.
- Review hover-dependent interactions and provide mobile-safe equivalents.

## Affected Pages/Components
- `app/layouts/admin.vue`
- `app/pages/admin/dashboard/index.vue`
- `app/pages/admin/index.vue`
- `app/pages/admin/categories/index.vue`
- `app/pages/admin/orders/index.vue`
- `app/pages/admin/users/index.vue`
- `app/pages/admin/settings/index.vue`
- `app/pages/admin/notifications/index.vue`
- `app/pages/admin/products/[id]/edit.vue`
- `app/pages/admin/categories/[id]/edit.vue`
- `app/components/admin/AdminTable.vue`
- `app/components/admin/AdminModal.vue`

## Expected UI/UX Result
- Core admin workflows remain practical on tablet and workable on mobile.
- Users can review records, edit entities, and navigate between sections without desktop-only assumptions.
- Responsive behavior feels designed, not merely compressed.
- Touch interactions become safer and less error-prone.

## Priority Level
Medium

## Suggested Implementation Order
1. Define responsive shell, topbar, and page-header rules.
2. Standardize mobile behavior for tables and row actions.
3. Adapt forms and modal content for smaller screens.
4. Tune touch targets and small-screen action patterns.
5. Validate critical workflows on tablet portrait, tablet landscape, and small-phone breakpoints.
