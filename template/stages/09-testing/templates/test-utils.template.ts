/**
 * Test Utilities
 *
 * Common testing utilities and custom render functions for React components.
 * Provides wrappers with providers (QueryClient, Router, Auth, etc.)
 */

import React, { ReactElement, ReactNode } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

// =============================================================================
// Custom Query Client for Tests
// =============================================================================

/**
 * Creates a fresh QueryClient for each test
 * Disables retries and caching for predictable test behavior
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Silence errors in tests
    },
  })
}

// =============================================================================
// Provider Wrappers
// =============================================================================

interface AllProvidersProps {
  children: ReactNode
  queryClient?: QueryClient
}

/**
 * Wraps children with all necessary providers for testing
 */
export function AllProviders({
  children,
  queryClient = createTestQueryClient(),
}: AllProvidersProps): ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

// =============================================================================
// Custom Render Functions
// =============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
  initialRoute?: string
}

/**
 * Custom render function that wraps component with all providers
 */
export function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult & { queryClient: QueryClient } {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options

  // Set initial route if provided
  if (options.initialRoute) {
    window.history.pushState({}, 'Test Page', options.initialRoute)
  }

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AllProviders queryClient={queryClient}>{children}</AllProviders>
  )

  const result = render(ui, { wrapper: Wrapper, ...renderOptions })

  return {
    ...result,
    queryClient,
  }
}

// =============================================================================
// User Event Setup
// =============================================================================

/**
 * Creates a user event instance with default options
 */
export function setupUser() {
  return userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
  })
}

// =============================================================================
// Async Utilities
// =============================================================================

/**
 * Waits for a condition to be true
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now()

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error(`Condition not met within ${timeout}ms`)
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }
}

/**
 * Waits for network requests to settle
 */
export async function waitForNetworkIdle(ms = 500): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

// =============================================================================
// Mock Data Generators
// =============================================================================

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Creates a mock user object
 */
export function createMockUser(overrides = {}) {
  return {
    id: generateId(),
    email: `user-${generateId()}@example.com`,
    name: 'Test User',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Creates a mock API response
 */
export function createMockResponse<T>(data: T, options: { status?: number } = {}) {
  return {
    data,
    status: options.status || 200,
    ok: (options.status || 200) < 400,
  }
}

// =============================================================================
// Assertion Helpers
// =============================================================================

/**
 * Asserts that an element has focus
 */
export function expectFocused(element: HTMLElement): void {
  expect(document.activeElement).toBe(element)
}

/**
 * Asserts form field has error
 */
export function expectFieldError(
  container: HTMLElement,
  fieldName: string,
  errorMessage: string
): void {
  const field = container.querySelector(`[name="${fieldName}"]`)
  expect(field).toHaveAttribute('aria-invalid', 'true')

  const errorId = field?.getAttribute('aria-describedby')
  if (errorId) {
    const errorElement = container.querySelector(`#${errorId}`)
    expect(errorElement).toHaveTextContent(errorMessage)
  }
}

// =============================================================================
// Exports
// =============================================================================

// Re-export everything from testing-library
export * from '@testing-library/react'
export { userEvent }

// Export custom render as default render
export { customRender as render }
