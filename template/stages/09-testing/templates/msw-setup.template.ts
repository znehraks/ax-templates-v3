/**
 * MSW (Mock Service Worker) Setup
 *
 * Intercepts network requests for testing.
 * Use in unit/integration tests for consistent API mocking.
 */

import { setupServer } from 'msw/node'
import { http, HttpResponse, delay } from 'msw'

// =============================================================================
// Default Handlers
// =============================================================================

/**
 * Default API handlers for common endpoints
 * Override these in individual tests as needed
 */
export const defaultHandlers = [
  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),

  // Authentication
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }

    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        user: { id: '1', email: body.email, name: 'Test User' },
        token: 'mock-jwt-token',
      })
    }

    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      })
    }

    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }),

  // Users CRUD
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'Alice', email: 'alice@example.com' },
      { id: '2', name: 'Bob', email: 'bob@example.com' },
    ])
  }),

  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'Test User',
      email: 'user@example.com',
    })
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(
      { id: 'new-id', ...(body as object) },
      { status: 201 }
    )
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: params.id, ...(body as object) })
  }),

  http.delete('/api/users/:id', () => {
    return HttpResponse.json({ success: true })
  }),
]

// =============================================================================
// Server Setup
// =============================================================================

/**
 * MSW server instance
 * Start in beforeAll, reset in afterEach, close in afterAll
 */
export const server = setupServer(...defaultHandlers)

// =============================================================================
// Test Setup Helpers
// =============================================================================

/**
 * Standard MSW setup for Vitest
 * Add to your test setup file
 */
export function setupMSW() {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
}

// =============================================================================
// Handler Factories
// =============================================================================

/**
 * Creates a handler that returns an error response
 */
export function createErrorHandler(
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  status: number,
  message: string
) {
  const httpMethod = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete,
  }[method]

  return httpMethod(path, () => {
    return HttpResponse.json({ error: message }, { status })
  })
}

/**
 * Creates a handler with artificial delay
 */
export function createDelayedHandler<T>(
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  data: T,
  delayMs: number = 1000
) {
  const httpMethod = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete,
  }[method]

  return httpMethod(path, async () => {
    await delay(delayMs)
    return HttpResponse.json(data)
  })
}

/**
 * Creates a handler that fails on first N calls then succeeds
 */
export function createRetryHandler<T>(
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  data: T,
  failCount: number = 1
) {
  let callCount = 0
  const httpMethod = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete,
  }[method]

  return httpMethod(path, () => {
    callCount++
    if (callCount <= failCount) {
      return HttpResponse.json({ error: 'Temporary failure' }, { status: 500 })
    }
    return HttpResponse.json(data)
  })
}

// =============================================================================
// Common Test Scenarios
// =============================================================================

export const errorHandlers = {
  serverError: createErrorHandler('get', '*', 500, 'Internal server error'),
  notFound: createErrorHandler('get', '*', 404, 'Not found'),
  unauthorized: createErrorHandler('get', '*', 401, 'Unauthorized'),
  forbidden: createErrorHandler('get', '*', 403, 'Forbidden'),
  badRequest: createErrorHandler('post', '*', 400, 'Bad request'),
}

export const networkHandlers = {
  slowResponse: (path: string) => createDelayedHandler('get', path, {}, 3000),
  timeout: http.get('*', async () => {
    await delay(30000) // Simulate timeout
    return HttpResponse.json({})
  }),
}

// =============================================================================
// Usage Examples
// =============================================================================

/*
// In your test file:

import { server, setupMSW, createErrorHandler } from './msw-setup'

setupMSW()

describe('MyComponent', () => {
  it('handles API error', () => {
    server.use(
      createErrorHandler('get', '/api/data', 500, 'Server error')
    )

    // ... test code
  })
})
*/
