/**
 * E2E Test Template (Playwright)
 *
 * Copy this template to create new E2E tests.
 * Replace {{FeatureName}} with your feature name.
 */

import { test, expect, Page } from '@playwright/test'

// =============================================================================
// Test Fixtures (Optional)
// =============================================================================

// Define custom fixtures for authenticated sessions
// test.use({
//   storageState: 'playwright/.auth/user.json',
// })

// =============================================================================
// Helper Functions
// =============================================================================

async function login(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.fill('[name="email"]', email)
  await page.fill('[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL('/dashboard')
}

async function waitForToast(page: Page, message: string) {
  const toast = page.locator('[role="alert"]').filter({ hasText: message })
  await expect(toast).toBeVisible()
}

// =============================================================================
// Test Suite: {{FeatureName}}
// =============================================================================

test.describe('{{FeatureName}}', () => {
  // ---------------------------------------------------------------------------
  // Setup & Teardown
  // ---------------------------------------------------------------------------

  test.beforeEach(async ({ page }) => {
    // Navigate to the starting page before each test
    // await page.goto('/')
  })

  test.afterEach(async ({ page }) => {
    // Cleanup after each test if needed
  })

  // ---------------------------------------------------------------------------
  // Happy Path Tests
  // ---------------------------------------------------------------------------

  test.describe('Happy Path', () => {
    test('user can complete the main flow', async ({ page }) => {
      // Navigate to the feature page
      // await page.goto('/feature')

      // Perform main actions
      // await page.click('button:has-text("Start")')
      // await page.fill('[name="input"]', 'test value')
      // await page.click('button[type="submit"]')

      // Verify success
      // await expect(page).toHaveURL('/success')
      // await expect(page.getByText('Success!')).toBeVisible()
    })

    test('user can navigate through steps', async ({ page }) => {
      // Step 1
      // await page.goto('/step-1')
      // await page.click('button:has-text("Next")')

      // Step 2
      // await expect(page).toHaveURL('/step-2')
      // await page.click('button:has-text("Next")')

      // Step 3
      // await expect(page).toHaveURL('/step-3')
      // await page.click('button:has-text("Complete")')

      // Final
      // await expect(page).toHaveURL('/complete')
    })
  })

  // ---------------------------------------------------------------------------
  // Form Tests
  // ---------------------------------------------------------------------------

  test.describe('Form Interactions', () => {
    test('validates required fields', async ({ page }) => {
      // await page.goto('/form')
      // await page.click('button[type="submit"]')

      // await expect(page.getByText('Field is required')).toBeVisible()
    })

    test('shows validation errors for invalid input', async ({ page }) => {
      // await page.goto('/form')
      // await page.fill('[name="email"]', 'invalid-email')
      // await page.click('button[type="submit"]')

      // await expect(page.getByText('Invalid email format')).toBeVisible()
    })

    test('submits form with valid data', async ({ page }) => {
      // await page.goto('/form')
      // await page.fill('[name="name"]', 'John Doe')
      // await page.fill('[name="email"]', 'john@example.com')
      // await page.click('button[type="submit"]')

      // await waitForToast(page, 'Form submitted successfully')
    })
  })

  // ---------------------------------------------------------------------------
  // Error Handling Tests
  // ---------------------------------------------------------------------------

  test.describe('Error Handling', () => {
    test('handles server errors gracefully', async ({ page }) => {
      // Mock API to return error
      await page.route('**/api/**', (route) =>
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal server error' }),
        })
      )

      // await page.goto('/feature')
      // await expect(page.getByText(/something went wrong/i)).toBeVisible()
    })

    test('handles network failure', async ({ page }) => {
      // Simulate offline
      await page.route('**/api/**', (route) => route.abort('failed'))

      // await page.goto('/feature')
      // await expect(page.getByText(/unable to connect/i)).toBeVisible()
    })

    test('allows retry after error', async ({ page }) => {
      let requestCount = 0

      await page.route('**/api/data', (route) => {
        requestCount++
        if (requestCount === 1) {
          return route.fulfill({ status: 500 })
        }
        return route.fulfill({
          status: 200,
          body: JSON.stringify({ data: 'success' }),
        })
      })

      // await page.goto('/feature')
      // await expect(page.getByText(/error/i)).toBeVisible()

      // await page.click('button:has-text("Retry")')
      // await expect(page.getByText('success')).toBeVisible()
    })
  })

  // ---------------------------------------------------------------------------
  // Authentication Tests
  // ---------------------------------------------------------------------------

  test.describe('Authentication', () => {
    test('redirects unauthenticated users to login', async ({ page }) => {
      await page.goto('/protected-page')
      await expect(page).toHaveURL(/\/login/)
    })

    test('authenticated user can access protected page', async ({ page }) => {
      // await login(page, 'user@example.com', 'password123')
      // await page.goto('/protected-page')
      // await expect(page.getByRole('heading')).toHaveText('Protected Content')
    })
  })

  // ---------------------------------------------------------------------------
  // Responsive Tests
  // ---------------------------------------------------------------------------

  test.describe('Responsive Design', () => {
    test('displays mobile menu on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      // await page.goto('/')

      // await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
      // await expect(page.getByRole('navigation')).not.toBeVisible()

      // await page.click('button[aria-label="Menu"]')
      // await expect(page.getByRole('navigation')).toBeVisible()
    })

    test('hides mobile menu on large screens', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      // await page.goto('/')

      // await expect(page.getByRole('navigation')).toBeVisible()
      // await expect(page.getByRole('button', { name: /menu/i })).not.toBeVisible()
    })
  })

  // ---------------------------------------------------------------------------
  // Visual Regression (Optional)
  // ---------------------------------------------------------------------------

  test.describe('Visual Regression', () => {
    test('matches snapshot', async ({ page }) => {
      // await page.goto('/feature')
      // await expect(page).toHaveScreenshot('feature-page.png')
    })
  })
})
