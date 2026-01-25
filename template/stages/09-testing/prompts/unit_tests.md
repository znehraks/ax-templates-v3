# Unit Testing Prompt - Testing & E2E

> **Auto-invoked at stage start** via Codex

## Overview

Write comprehensive unit tests for all source code components with a focus on:
- Isolated function/method testing
- Mock strategies for dependencies
- Edge case coverage
- Maintainable test structure

## Test Framework: Vitest + @testing-library/react

### Why Vitest?
- Native ESM support
- TypeScript support out of the box
- Jest-compatible API
- Faster execution with Vite

## Coverage Targets

| Metric | Target | Priority |
|--------|--------|----------|
| Statements | 80% | Required |
| Branches | 75% | Required |
| Functions | 80% | Required |
| Lines | 80% | Required |

## Test Categories

### 1. Utility Functions

```typescript
// Example: Testing a utility function
import { describe, it, expect } from 'vitest'
import { formatCurrency, parseDate, validateEmail } from '@/utils'

describe('formatCurrency', () => {
  it('formats positive numbers with default currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('handles negative numbers', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
  })

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('respects custom currency', () => {
    expect(formatCurrency(100, 'EUR')).toBe('€100.00')
  })
})
```

### 2. React Components

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-primary')
  })
})
```

### 3. Custom Hooks

```typescript
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCounter } from '@/hooks/useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10))
    expect(result.current.count).toBe(10)
  })

  it('increments count', () => {
    const { result } = renderHook(() => useCounter())
    act(() => result.current.increment())
    expect(result.current.count).toBe(1)
  })

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(5))
    act(() => result.current.decrement())
    expect(result.current.count).toBe(4)
  })
})
```

### 4. API Handlers / Services

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userService } from '@/services/userService'

// Mock fetch globally
global.fetch = vi.fn()

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches user by id', async () => {
    const mockUser = { id: '1', name: 'John' }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser),
    } as Response)

    const user = await userService.getById('1')
    expect(user).toEqual(mockUser)
    expect(fetch).toHaveBeenCalledWith('/api/users/1')
  })

  it('throws on network error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    await expect(userService.getById('1')).rejects.toThrow('Network error')
  })

  it('throws on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    await expect(userService.getById('1')).rejects.toThrow()
  })
})
```

## Mock Strategies

### 1. Module Mocking

```typescript
import { vi } from 'vitest'

// Mock entire module
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ data: [], error: null }),
  },
}))
```

### 2. Partial Mocking

```typescript
import { vi } from 'vitest'
import * as utils from '@/utils'

// Spy on specific function
vi.spyOn(utils, 'calculateTax').mockReturnValue(100)
```

### 3. Timer Mocking

```typescript
import { vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

it('debounces input', async () => {
  // ... test code
  vi.advanceTimersByTime(500)
  // ... assertions
})
```

## File Organization

```
tests/
├── unit/
│   ├── components/
│   │   ├── Button.test.tsx
│   │   ├── Input.test.tsx
│   │   └── Card.test.tsx
│   ├── hooks/
│   │   ├── useAuth.test.ts
│   │   └── useCounter.test.ts
│   ├── utils/
│   │   ├── format.test.ts
│   │   └── validation.test.ts
│   └── services/
│       ├── api.test.ts
│       └── auth.test.ts
├── setup.ts
└── mocks/
    ├── handlers.ts
    └── server.ts
```

## Test Execution

```bash
# Run all unit tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Run specific file
npm run test -- Button.test.tsx

# Run with UI
npm run test:ui
```

## Output Requirements

Generate the following for each tested module:

1. **Test file** in appropriate `tests/unit/` subdirectory
2. **Mocks** if dependencies need isolation
3. **Test coverage** meeting thresholds

## Codex Prompt Template

```
Write unit tests for the following code:

[CODE]

Requirements:
- Use Vitest and @testing-library/react
- Cover all public functions/methods
- Include edge cases and error scenarios
- Mock external dependencies
- Target 80% coverage

Test file structure:
- describe block for each function/component
- it blocks for each behavior
- Clear test names describing expected behavior
```
