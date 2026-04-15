Final phase for Vigo Store. Handle UX issues:

### TASK 15 — Fix Admin Search
File: app/layouts/admin.vue

Connect searchQuery to actual filtering of menu items or page content.
If it's a global search, emit the query and handle per-page.

### TASK 16 — Fix Filter Buttons on Products Page
File: app/pages/products/index.vue

Add click handlers to size filter buttons:
- Track selectedSize with ref
- Filter products by size on click
- Highlight active filter button

### TASK 17 — Implement Export to Excel or Remove Button
File: app/pages/admin/orders/index.vue

Option A — Implement it:
  Install: npm install xlsx
  Create exportToExcel function that exports current orders to .xlsx

Option B — Remove it:
  Delete the export button entirely

Choose Option A and implement it.

### TASK 18 — Fix Forgot Password (Placeholder)
File: app/pages/auth/login.vue

Either:
  a) Navigate to /auth/forgot-password page (create the page with email input)
  b) Or remove the link

Implement option (a) with a basic forgot-password page that takes an email and shows a success message.

Show me all updated files.