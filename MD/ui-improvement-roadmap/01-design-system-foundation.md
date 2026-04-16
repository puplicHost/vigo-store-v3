# Phase 01: Design System Foundation

## Objective of the Phase
Create a stable UI foundation for the admin experience by formalizing typography, spacing, semantic color usage, button hierarchy, card structure, form controls, and reusable tokens. This phase converts the current premium visual language into a repeatable system that can be applied consistently across all admin pages.

## Problems Being Solved
- Existing CSS variables in `app/assets/css/main.css` provide a good base, but they are not documented as a complete design system.
- Page implementations rely heavily on local utility composition, which increases drift between screens.
- Button, card, badge, and input styles vary by page, making the UI feel partially unified rather than fully systematized.
- Typography usage mixes serif display styling and operational text patterns without a formal hierarchy.
- Spacing choices are visually acceptable in isolation but are not governed by a single density model for admin workflows.

## Detailed Improvement Tasks

### 1. Define Typography Hierarchy
- Establish explicit text roles for page title, section title, card title, label, helper text, table header, body text, and status text.
- Reserve serif usage for strategic display moments such as top-level page headings and premium dashboard highlights.
- Standardize all operational UI copy, filters, form labels, table cells, and notifications on a single body font hierarchy.
- Introduce rules for uppercase micro-labels so they are used for metadata and section identifiers only, not for high-volume reading surfaces.

### 2. Formalize a Spacing System
- Create a spacing scale for page gutters, section gaps, card padding, control heights, form group spacing, and table row density.
- Define compact, default, and spacious density modes for different UI contexts:
  - compact for dense tables and KPI summaries
  - default for forms and content sections
  - spacious for dashboards and page headers
- Standardize vertical rhythm so every admin page follows the same header-to-toolbar-to-content spacing pattern.

### 3. Normalize Color Palette Usage
- Map current CSS tokens into semantic UI roles such as primary action, supporting action, success, warning, error, information, neutral surface, border, and emphasis.
- Define approved usage for gradients so they enhance premium presentation without overwhelming operational surfaces.
- Establish consistent contrast expectations for text on tinted surfaces, badges, hover states, and chart-adjacent panels.
- Separate decorative color usage from status color usage to reduce ambiguity.

### 4. Standardize Button Variants
- Define button families for primary, secondary, tertiary, ghost, destructive, and icon-only actions.
- Create rules for button sizing, icon placement, disabled appearance, loading state, and placement priority.
- Standardize action hierarchy across pages:
  - one clear primary action per section
  - low-friction secondary actions for supporting tasks
  - destructive actions visually separated from productive actions

### 5. Define Card Patterns
- Establish card templates for KPI cards, content cards, form cards, filters/toolbars, alert cards, and empty-state containers.
- Normalize radius, shadow intensity, border presence, surface layering, and hover behavior.
- Define internal spacing for card header, body, footer, and action zones.
- Reduce overuse of highly decorative treatments on utility views while preserving premium styling on summary surfaces.

### 6. Standardize Form Controls
- Define consistent height, padding, label spacing, helper text spacing, and error text treatment for inputs, selects, textareas, toggles, and action footers.
- Create rules for required-field indicators, placeholder usage, field grouping, and multi-column layouts.
- Introduce common patterns for search fields, inline filters, modal forms, and full-page edit forms.

### 7. Establish Reusable UI Tokens
- Document token categories for color, typography, spacing, radius, elevation, border treatment, motion, and control sizing.
- Align shared admin components with the token model so future pages extend the system rather than bypass it.
- Define component acceptance rules before new variants are added to prevent uncontrolled visual growth.

## Affected Pages/Components
- `app/assets/css/main.css`
- `app/layouts/admin.vue`
- `app/components/admin/AdminTable.vue`
- `app/components/admin/AdminModal.vue`
- `app/components/admin/StatusBadge.vue`
- `app/components/admin/EmptyState.vue`
- `app/components/admin/SkeletonLoader.vue`
- `app/components/TheToasts.vue`
- `app/pages/admin/dashboard/index.vue`
- `app/pages/admin/index.vue`
- `app/pages/admin/categories/index.vue`
- `app/pages/admin/orders/index.vue`
- `app/pages/admin/users/index.vue`
- `app/pages/admin/settings/index.vue`
- `app/pages/admin/products/[id]/edit.vue`
- `app/pages/admin/categories/[id]/edit.vue`

## Expected UI/UX Result
- Every admin surface uses the same visual grammar for text, actions, containers, and states.
- Developers can build new admin pages faster because component decisions are made once at the system level.
- The interface feels intentionally designed rather than page-assembled.
- Design debt is reduced before higher-level workflow and dashboard improvements are implemented.

## Priority Level
Critical

## Suggested Implementation Order
1. Audit current token usage and identify style duplication across the admin shell and CRUD pages.
2. Define typography, spacing, semantic color, and elevation rules.
3. Standardize button, card, badge, and form-control variants.
4. Align shared admin components to the new rules.
5. Use the resulting system as the baseline for all later roadmap phases.
