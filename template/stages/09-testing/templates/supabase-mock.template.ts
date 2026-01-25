/**
 * Supabase Client Mock
 *
 * Comprehensive mock for Supabase client in unit/integration tests.
 * Addresses common Supabase testing patterns and edge cases.
 */

import { vi } from 'vitest'

// =============================================================================
// Types
// =============================================================================

interface MockQueryResult<T = unknown> {
  data: T | null
  error: { message: string; code?: string } | null
  count?: number
  status?: number
  statusText?: string
}

interface MockAuthResult {
  data: {
    user: MockUser | null
    session: MockSession | null
  }
  error: { message: string; code?: string } | null
}

interface MockUser {
  id: string
  email: string
  role: string
  app_metadata: Record<string, unknown>
  user_metadata: Record<string, unknown>
  created_at: string
}

interface MockSession {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at: number
  user: MockUser
}

// =============================================================================
// Mock User Factory
// =============================================================================

export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: 'mock-user-id',
    email: 'test@example.com',
    role: 'authenticated',
    app_metadata: {},
    user_metadata: { name: 'Test User' },
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockSession(
  user: MockUser = createMockUser()
): MockSession {
  return {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user,
  }
}

// =============================================================================
// Query Builder Mock
// =============================================================================

function createQueryBuilder<T = unknown>() {
  let result: MockQueryResult<T> = { data: null, error: null }

  const builder = {
    // Data manipulation
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),

    // Filters
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    overlaps: vi.fn().mockReturnThis(),
    textSearch: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),

    // Modifiers
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),

    // Result modifiers
    returns: vi.fn().mockReturnThis(),
    csv: vi.fn().mockReturnThis(),

    // Execute and return result
    then: vi.fn((resolve) => resolve(result)),

    // Helper to set mock result
    __setResult: (data: T | null, error: MockQueryResult['error'] = null) => {
      result = { data, error }
    },
  }

  return builder
}

// =============================================================================
// Auth Mock
// =============================================================================

function createAuthMock() {
  let currentUser: MockUser | null = null
  let currentSession: MockSession | null = null

  const authMock = {
    // Session management
    getSession: vi.fn().mockImplementation(async () => ({
      data: { session: currentSession },
      error: null,
    })),

    getUser: vi.fn().mockImplementation(async () => ({
      data: { user: currentUser },
      error: null,
    })),

    // Sign in methods
    signInWithPassword: vi.fn().mockImplementation(async ({ email }) => {
      const user = createMockUser({ email })
      const session = createMockSession(user)
      currentUser = user
      currentSession = session
      return { data: { user, session }, error: null }
    }),

    signInWithOAuth: vi.fn().mockImplementation(async () => ({
      data: { provider: 'google', url: 'https://mock-oauth-url.com' },
      error: null,
    })),

    signInWithOtp: vi.fn().mockImplementation(async () => ({
      data: { user: null, session: null },
      error: null,
    })),

    // Sign up
    signUp: vi.fn().mockImplementation(async ({ email }) => {
      const user = createMockUser({ email })
      return { data: { user, session: null }, error: null }
    }),

    // Sign out
    signOut: vi.fn().mockImplementation(async () => {
      currentUser = null
      currentSession = null
      return { error: null }
    }),

    // Password reset
    resetPasswordForEmail: vi.fn().mockImplementation(async () => ({
      data: {},
      error: null,
    })),

    updateUser: vi.fn().mockImplementation(async (updates) => {
      if (currentUser) {
        currentUser = { ...currentUser, ...updates }
      }
      return { data: { user: currentUser }, error: null }
    }),

    // Event listeners
    onAuthStateChange: vi.fn().mockImplementation((callback) => {
      // Immediately call with current state
      callback('INITIAL_SESSION', currentSession)
      return {
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      }
    }),

    // Helper methods for tests
    __setUser: (user: MockUser | null) => {
      currentUser = user
      currentSession = user ? createMockSession(user) : null
    },

    __reset: () => {
      currentUser = null
      currentSession = null
    },
  }

  return authMock
}

// =============================================================================
// Storage Mock
// =============================================================================

function createStorageMock() {
  const files = new Map<string, Blob>()

  return {
    from: vi.fn((bucket: string) => ({
      upload: vi.fn().mockImplementation(async (path, file) => {
        files.set(`${bucket}/${path}`, file)
        return { data: { path }, error: null }
      }),

      download: vi.fn().mockImplementation(async (path) => {
        const file = files.get(`${bucket}/${path}`)
        return {
          data: file || null,
          error: file ? null : { message: 'File not found' },
        }
      }),

      remove: vi.fn().mockImplementation(async (paths: string[]) => {
        paths.forEach((path) => files.delete(`${bucket}/${path}`))
        return { data: { message: 'Deleted' }, error: null }
      }),

      getPublicUrl: vi.fn().mockImplementation((path) => ({
        data: { publicUrl: `https://mock-storage.com/${bucket}/${path}` },
      })),

      list: vi.fn().mockImplementation(async () => ({
        data: Array.from(files.keys())
          .filter((key) => key.startsWith(bucket))
          .map((key) => ({ name: key.replace(`${bucket}/`, '') })),
        error: null,
      })),

      createSignedUrl: vi.fn().mockImplementation(async (path, expiresIn) => ({
        data: {
          signedUrl: `https://mock-storage.com/${bucket}/${path}?token=mock&expires=${expiresIn}`,
        },
        error: null,
      })),
    })),

    // Helper for tests
    __clear: () => files.clear(),
  }
}

// =============================================================================
// Realtime Mock
// =============================================================================

function createRealtimeMock() {
  const channels = new Map<string, { callbacks: Function[] }>()

  return {
    channel: vi.fn((name: string) => {
      if (!channels.has(name)) {
        channels.set(name, { callbacks: [] })
      }

      return {
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockImplementation((callback) => {
          callback?.('SUBSCRIBED')
          return { unsubscribe: vi.fn() }
        }),
        unsubscribe: vi.fn(),
        send: vi.fn(),
      }
    }),

    removeChannel: vi.fn((channel) => {
      channels.delete(channel.name)
    }),

    removeAllChannels: vi.fn(() => {
      channels.clear()
    }),
  }
}

// =============================================================================
// Complete Supabase Mock
// =============================================================================

export function createSupabaseMock() {
  const queryBuilder = createQueryBuilder()
  const auth = createAuthMock()
  const storage = createStorageMock()
  const realtime = createRealtimeMock()

  const supabaseMock = {
    // Database queries
    from: vi.fn().mockReturnValue(queryBuilder),

    // RPC calls
    rpc: vi.fn().mockImplementation(async () => ({
      data: null,
      error: null,
    })),

    // Auth
    auth,

    // Storage
    storage,

    // Realtime
    channel: realtime.channel,
    removeChannel: realtime.removeChannel,
    removeAllChannels: realtime.removeAllChannels,

    // Query builder reference (for test setup)
    __queryBuilder: queryBuilder,

    // Reset all mocks
    __reset: () => {
      vi.clearAllMocks()
      auth.__reset()
      storage.__clear()
    },
  }

  return supabaseMock
}

// =============================================================================
// Module Mock Setup
// =============================================================================

/**
 * Use this to mock the entire @/lib/supabase module
 *
 * Usage in test setup:
 * vi.mock('@/lib/supabase', () => mockSupabaseModule())
 */
export function mockSupabaseModule() {
  const mock = createSupabaseMock()

  return {
    supabase: mock,
    createClient: vi.fn().mockReturnValue(mock),
  }
}

// =============================================================================
// Usage Examples
// =============================================================================

/*
// In your test file:

import { createSupabaseMock, createMockUser } from './supabase-mock'

const supabase = createSupabaseMock()

// Mock authenticated user
supabase.auth.__setUser(createMockUser({ email: 'test@example.com' }))

// Mock database query result
supabase.__queryBuilder.__setResult([
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
])

// Reset between tests
afterEach(() => {
  supabase.__reset()
})
*/
