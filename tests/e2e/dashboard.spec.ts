import { test, expect } from '@playwright/test'

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[type="email"]', 'ahmed.admin@vigo.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin/dashboard')
  })

  test('should display dashboard with stats cards', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard')
    await expect(page.locator('text=Total Products')).toBeVisible()
    await expect(page.locator('text=Categories')).toBeVisible()
    await expect(page.locator('text=Total Orders')).toBeVisible()
    await expect(page.locator('text=Total Users')).toBeVisible()
  })

  test('should display low stock alert when products have low stock', async ({ page }) => {
    const lowStockSection = page.locator('text=Low Stock Alert')
    if (await lowStockSection.isVisible()) {
      await expect(page.locator('text=Restock')).toBeVisible()
    }
  })

  test('should display revenue chart', async ({ page }) => {
    await expect(page.locator('.apexcharts-canvas')).toBeVisible()
  })

  test('should display orders chart', async ({ page }) => {
    await expect(page.locator('.apexcharts-canvas')).toBeVisible()
  })

  test('should display recent orders table', async ({ page }) => {
    await expect(page.locator('text=Recent Orders')).toBeVisible()
    await expect(page.locator('table')).toBeVisible()
  })

  test('should display quick links', async ({ page }) => {
    await expect(page.locator('text=Manage Products')).toBeVisible()
    await expect(page.locator('text=Manage Categories')).toBeVisible()
    await expect(page.locator('text=Manage Users')).toBeVisible()
    await expect(page.locator('text=Store Settings')).toBeVisible()
  })

  test('should show seed data button only for SUPER_ADMIN', async ({ page }) => {
    const seedButton = page.locator('text=Seed Data')
    const userRole = await page.locator('text=SUPER_ADMIN').isVisible()

    if (userRole) {
      await expect(seedButton).toBeVisible()
    } else {
      await expect(seedButton).not.toBeVisible()
    }
  })
})

test.describe('Permission-based Access Control', () => {
  test('SALES role should not see Users page in sidebar', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'mahmoud.sales@vigo.com')
    await page.fill('input[type="password"]', 'sales123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin/dashboard')

    const usersLink = page.locator('text=Users')
    await expect(usersLink).not.toBeVisible()
  })

  test('MANAGER role should not see Settings page in sidebar', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'omar.manager@vigo.com')
    await page.fill('input[type="password"]', 'manager123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin/dashboard')

    const settingsLink = page.locator('text=Settings')
    await expect(settingsLink).not.toBeVisible()
  })

  test('SUPER_ADMIN should see all pages in sidebar', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'super.admin@vigo.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin/dashboard')

    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Inventory')).toBeVisible()
    await expect(page.locator('text=Categories')).toBeVisible()
    await expect(page.locator('text=Orders')).toBeVisible()
    await expect(page.locator('text=Users')).toBeVisible()
    await expect(page.locator('text=Settings')).toBeVisible()
  })
})

test.describe('Login Flow', () => {
  test('should redirect unauthenticated user to login page', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.waitForURL('/login')
    await expect(page.locator('h1')).toContainText('Login')
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'ahmed.admin@vigo.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'wrong@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })
})
