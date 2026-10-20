import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/modules/**'],
      exclude: ['**/*.test.ts', 'src/db/**', 'src/env/**'],
    },
  },
})
