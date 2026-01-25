/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  test: {
    // Test environment
    environment: 'jsdom',

    // Global setup/teardown
    setupFiles: ['./tests/setup.ts'],

    // Include patterns
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],

    // Exclude patterns
    exclude: ['tests/e2e/**', 'node_modules/**'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',

      // Coverage thresholds
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },

      // Files to include in coverage
      include: ['src/**/*.{ts,tsx}'],

      // Files to exclude from coverage
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/**/index.ts',
        'src/types/**',
        'src/mocks/**',
      ],
    },

    // Test globals (describe, it, expect available globally)
    globals: true,

    // Reporter configuration
    reporters: ['default', 'html'],
    outputFile: {
      html: './test-results/index.html',
    },

    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,

    // Retry failed tests
    retry: process.env.CI ? 2 : 0,

    // Watch mode configuration
    watch: false,

    // Parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },

    // Mocking
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,

    // Snapshot configuration
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: true,
    },
  },

  // Path aliases (match tsconfig paths)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
})
