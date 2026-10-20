import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), '')
  process.env.DATABASE_URL ??= fileEnv.DATABASE_URL

  return {
    test: {
      globals: true,
      environment: 'node',
      include: ['src/**/*.test.ts'],
      exclude: ['**/node_modules/**', '**/*.integration.test.ts'],
      clearMocks: true,
      coverage: {
        provider: 'v8',
        include: ['src/modules/**'],
        exclude: ['**/*.test.ts', 'src/db/**', 'src/env/**'],
      },
    },
  }
})
