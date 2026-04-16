# Phase 03: Dashboard Visual Enhancements

## Objective of the Phase
Redesign the dashboard experience so it communicates business health, operational risk, and short-term priorities with greater clarity. This phase focuses on transforming the dashboard from a visually attractive page into a high-confidence decision surface.

## Problems Being Solved
- The current dashboard in `app/pages/admin/dashboard/index.vue` contains strong visual treatments, but information priority is not consistently enforced.
- KPI cards use decorative styling effectively, yet comparison patterns, supporting context, and trend interpretation are inconsistent.
- Charts and summary blocks compete visually instead of guiding the eye from primary to secondary insights.
- Empty, low-volume, and exception-oriented widgets need more intentional handling.
- Surface variety is high, which can make the dashboard feel premium but slightly fragmented.

## Detailed Improvement Tasks

### 1. Redesign KPI Cards
- Create a standard KPI-card model with:
  - metric label
  - primary value
  - trend or delta
  - contextual note
  - optional action or drill-down
- Normalize icon size, card padding, label treatment, and metric prominence across products, categories, orders, users, revenue, and operational alerts.
- Differentiate informational KPIs from actionable risk KPIs such as low stock or pending operational blockers.

### 2. Improve Chart Hierarchy
- Establish one primary analytics panel per viewport section and treat supporting charts as secondary.
- Reduce decorative competition around chart containers so the data becomes the visual focus.
- Standardize chart headers with clear title, time range, explanation text, and view controls.
- Define fallback patterns for chart loading and no-data states.

### 3. Balance the Analytics Section
- Reassess the current order of KPI summaries, alert surfaces, charts, and secondary statistics.
- Group related information so revenue, order flow, user mix, and inventory risk are not scattered across unrelated surfaces.
- Avoid placing equally strong visual treatments next to each other when one of them should clearly lead.

### 4. Emphasize Important Metrics
- Prioritize revenue, orders, low-stock alerts, and time-sensitive changes in the top scanning zone.
- Use emphasis through scale, placement, and contrast before using more color or more decoration.
- Make comparative metrics meaningful by standardizing trend logic and timeframe framing.

### 5. Improve Empty Widget Handling
- Define low-data and empty-data treatments for charts, alerts, and metric cards.
- Replace blank or overly generic placeholders with contextual explanations and next actions.
- Ensure empty widgets preserve layout stability and still communicate value.

## Affected Pages/Components
- `app/pages/admin/dashboard/index.vue`
- `app/components/admin/SkeletonLoader.vue`
- `app/components/admin/EmptyState.vue`
- `app/assets/css/main.css`
- Shared card and badge patterns introduced in `01-design-system-foundation.md`

## Expected UI/UX Result
- The dashboard communicates critical business information in a clear scanning order.
- KPI cards feel premium and consistent without overwhelming the user with decorative noise.
- Charts become easier to interpret because supporting context and visual hierarchy are standardized.
- Empty and low-data scenarios feel intentional instead of incomplete.

## Priority Level
High

## Suggested Implementation Order
1. Define dashboard information hierarchy and metric priority map.
2. Standardize KPI card structure and trend presentation.
3. Reorganize chart sections and supporting analytics blocks.
4. Add low-data, empty, and loading-state patterns for dashboard widgets.
5. Validate the final dashboard against executive scanning and daily operations use cases.
