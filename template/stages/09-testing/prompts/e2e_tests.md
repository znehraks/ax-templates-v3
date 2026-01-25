# E2E Testing Prompt - Testing & E2E

> **Enables Playwright MCP server** for browser automation

## Overview

Write end-to-end tests that verify complete user flows through the application using Playwright.

## Test Framework: Playwright

### Why Playwright?
- Cross-browser testing (Chromium, Firefox, WebKit)
- Auto-wait for elements
- Built-in test isolation
- Powerful debugging tools
- Native TypeScript support

## E2E Test Categories

### 1. Authentication Flows

```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can sign up', async ({ page }) => {
    await page.goto('/signup')

    await page.fill('[name="email"]', 'newuser@example.com')
    await page.fill('[name="password"]', 'SecurePass123!')
    await page.fill('[name="confirmPassword"]', 'SecurePass123!')
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Welcome')).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await page.goto('/login')

    await page.fill('[name="email"]', 'user@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
  })

  test('user can log out', async ({ page }) => {
    // Assume logged in (use fixture)
    await page.goto('/dashboard')

    await page.click('[data-testid="user-menu"]')
    await page.click('text=Log out')

    await expect(page).toHaveURL('/login')
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('[name="email"]', 'wrong@example.com')
    await page.fill('[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
    await expect(page).toHaveURL('/login')
  })
})
```

### 2. Core Feature Flows

```typescript
import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('[name="email"]', 'user@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('displays user data', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
    await expect(page.getByTestId('user-stats')).toBeVisible()
  })

  test('can create new item', async ({ page }) => {
    await page.click('button:has-text("Create New")')

    await page.fill('[name="title"]', 'Test Item')
    await page.fill('[name="description"]', 'Test description')
    await page.click('button[type="submit"]')

    await expect(page.getByText('Test Item')).toBeVisible()
    await expect(page.getByText('Item created successfully')).toBeVisible()
  })

  test('can edit existing item', async ({ page }) => {
    await page.click('[data-testid="item-1"] >> button:has-text("Edit")')

    await page.fill('[name="title"]', 'Updated Title')
    await page.click('button[type="submit"]')

    await expect(page.getByText('Updated Title')).toBeVisible()
  })

  test('can delete item with confirmation', async ({ page }) => {
    await page.click('[data-testid="item-1"] >> button:has-text("Delete")')

    // Confirm dialog
    await expect(page.getByText('Are you sure?')).toBeVisible()
    await page.click('button:has-text("Confirm")')

    await expect(page.getByTestId('item-1')).not.toBeVisible()
  })
})
```

### 3. Form Validation

```typescript
import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test('validates required fields', async ({ page }) => {
    await page.goto('/contact')

    await page.click('button[type="submit"]')

    await expect(page.getByText('Name is required')).toBeVisible()
    await expect(page.getByText('Email is required')).toBeVisible()
    await expect(page.getByText('Message is required')).toBeVisible()
  })

  test('validates email format', async ({ page }) => {
    await page.goto('/contact')

    await page.fill('[name="email"]', 'invalid-email')
    await page.click('button[type="submit"]')

    await expect(page.getByText('Invalid email format')).toBeVisible()
  })

  test('submits valid form successfully', async ({ page }) => {
    await page.goto('/contact')

    await page.fill('[name="name"]', 'John Doe')
    await page.fill('[name="email"]', 'john@example.com')
    await page.fill('[name="message"]', 'Hello, this is a test message.')
    await page.click('button[type="submit"]')

    await expect(page.getByText('Message sent successfully')).toBeVisible()
  })
})
```

### 4. Navigation and Routing

```typescript
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('can navigate between pages', async ({ page }) => {
    await page.goto('/')

    await page.click('text=About')
    await expect(page).toHaveURL('/about')

    await page.click('text=Services')
    await expect(page).toHaveURL('/services')

    await page.click('text=Contact')
    await expect(page).toHaveURL('/contact')
  })

  test('redirects unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page).toHaveURL('/login?redirect=/dashboard')
  })

  test('404 page for unknown routes', async ({ page }) => {
    await page.goto('/unknown-page')

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    await expect(page.getByText('Page not found')).toBeVisible()
  })
})
```

### 5. Error Handling

```typescript
import { test, expect } from '@playwright/test'

test.describe('Error Handling', () => {
  test('handles network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.route('**/api/**', (route) => route.abort('failed'))

    await page.goto('/dashboard')

    await expect(page.getByText(/unable to load/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /retry/i })).toBeVisible()
  })

  test('displays server error message', async ({ page }) => {
    await page.route('**/api/data', (route) =>
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      })
    )

    await page.goto('/dashboard')

    await expect(page.getByText(/something went wrong/i)).toBeVisible()
  })
})
```

## Playwright MCP Integration

When the Playwright MCP server is enabled, you can interact with the browser directly:

```bash
# MCP server enables these capabilities:
- Browser automation via Claude
- Visual testing
- Screenshot capture
- Network interception
```

## Test Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## File Organization

```
tests/
└── e2e/
    ├── auth.spec.ts
    ├── dashboard.spec.ts
    ├── forms.spec.ts
    ├── navigation.spec.ts
    ├── fixtures/
    │   └── auth.ts
    └── helpers/
        └── test-utils.ts
```

## Test Execution

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e auth.spec.ts

# Run in headed mode (visible browser)
npm run test:e2e -- --headed

# Run in debug mode
npm run test:e2e -- --debug

# Generate HTML report
npm run test:e2e -- --reporter=html
```

## Codex Prompt Template

```
Write E2E tests for the following user flow:

[USER FLOW DESCRIPTION]

Requirements:
- Use Playwright test framework
- Test complete user journey from start to finish
- Include happy path and error scenarios
- Use data-testid attributes for selectors when possible
- Include appropriate wait conditions

Focus areas:
- User authentication state
- Form interactions
- Navigation between pages
- Error handling and recovery
```
