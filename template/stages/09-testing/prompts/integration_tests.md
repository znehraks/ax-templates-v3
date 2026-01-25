# Integration Testing Prompt - Testing & E2E

## Overview

Write integration tests that verify interactions between multiple components, services, and external systems.

## Test Framework: Vitest + MSW (Mock Service Worker)

### Why MSW?
- Intercepts requests at the network level
- Works in both Node.js and browser
- Consistent mocking for all HTTP clients
- Realistic API mocking

## Integration Test Categories

### 1. API Integration Tests

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { apiClient } from '@/lib/api'

const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ])
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: '3', ...body }, { status: 201 })
  }),

  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'Alice' })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('API Integration', () => {
  describe('Users API', () => {
    it('fetches all users', async () => {
      const users = await apiClient.getUsers()

      expect(users).toHaveLength(2)
      expect(users[0]).toEqual({ id: '1', name: 'Alice' })
    })

    it('creates a new user', async () => {
      const newUser = await apiClient.createUser({ name: 'Charlie' })

      expect(newUser.id).toBe('3')
      expect(newUser.name).toBe('Charlie')
    })

    it('handles API errors', async () => {
      server.use(
        http.get('/api/users', () => {
          return HttpResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
          )
        })
      )

      await expect(apiClient.getUsers()).rejects.toThrow()
    })
  })
})
```

### 2. Component Integration Tests

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserList } from '@/components/UserList'

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'Alice', email: 'alice@example.com' },
      { id: '2', name: 'Bob', email: 'bob@example.com' },
    ])
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}

describe('UserList Integration', () => {
  it('fetches and displays users', async () => {
    renderWithProviders(<UserList />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })
  })

  it('handles empty state', async () => {
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json([])
      })
    )

    renderWithProviders(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('No users found')).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 500 })
      })
    )

    renderWithProviders(<UserList />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
```

### 3. Form Submission Integration

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { ContactForm } from '@/components/ContactForm'

const server = setupServer(
  http.post('/api/contact', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ success: true, id: '123' })
  })
)

describe('ContactForm Integration', () => {
  it('submits form data and shows success', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()

    render(<ContactForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Hello!')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({ success: true, id: '123' })
    })
  })

  it('shows validation errors', async () => {
    const user = userEvent.setup()

    render(<ContactForm />)

    // Submit without filling required fields
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })

  it('handles server validation errors', async () => {
    server.use(
      http.post('/api/contact', () => {
        return HttpResponse.json(
          { errors: { email: 'Email already registered' } },
          { status: 422 }
        )
      })
    )

    const user = userEvent.setup()

    render(<ContactForm />)

    await user.type(screen.getByLabelText(/name/i), 'John')
    await user.type(screen.getByLabelText(/email/i), 'taken@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Test')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument()
    })
  })
})
```

### 4. Authentication Flow Integration

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { AuthProvider } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/LoginForm'
import { ProtectedRoute } from '@/components/ProtectedRoute'

const server = setupServer(
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json()

    if (email === 'user@example.com' && password === 'password123') {
      return HttpResponse.json({
        user: { id: '1', email: 'user@example.com' },
        token: 'mock-jwt-token',
      })
    }

    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (authHeader === 'Bearer mock-jwt-token') {
      return HttpResponse.json({ id: '1', email: 'user@example.com' })
    }

    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Authentication Flow', () => {
  it('logs in successfully with valid credentials', async () => {
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument()
    })
  })

  it('shows error with invalid credentials', async () => {
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })
})
```

## Database Mocking Strategy

### Option 1: In-Memory Database

```typescript
import { beforeEach } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended'

export const prismaMock = mockDeep<PrismaClient>()

beforeEach(() => {
  mockReset(prismaMock)
})
```

### Option 2: Test Database

```typescript
// Use a separate test database with seed data
// Configure in vitest.config.ts
export default {
  test: {
    env: {
      DATABASE_URL: 'postgresql://localhost:5432/testdb',
    },
  },
}
```

## File Organization

```
tests/
├── integration/
│   ├── api/
│   │   ├── users.test.ts
│   │   └── auth.test.ts
│   ├── components/
│   │   ├── UserList.test.tsx
│   │   └── ContactForm.test.tsx
│   ├── flows/
│   │   ├── authentication.test.tsx
│   │   └── checkout.test.tsx
│   └── setup.ts
└── mocks/
    ├── handlers/
    │   ├── users.ts
    │   └── auth.ts
    └── server.ts
```

## Test Execution

```bash
# Run integration tests
npm run test:integration

# Run with specific handler mocks
npm run test:integration -- --grep "Users API"
```

## Codex Prompt Template

```
Write integration tests for the following feature:

[FEATURE DESCRIPTION]

Requirements:
- Use Vitest and MSW for API mocking
- Test the complete data flow from UI to API
- Include error handling scenarios
- Mock external services appropriately

Focus areas:
- API request/response handling
- State management integration
- User interaction flows
- Error boundary behavior
```
