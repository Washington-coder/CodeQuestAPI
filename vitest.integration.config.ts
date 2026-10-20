import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // mode = 'test' -> carrega .env.test (DATABASE_URL do banco de teste, NODE_ENV=test)
  const fileEnv = loadEnv(mode, process.cwd(), '')
  process.env.DATABASE_URL ??= fileEnv.DATABASE_URL
  process.env.NODE_ENV ??= fileEnv.NODE_ENV

  return {
    test: {
      globals: true,
      environment: 'node',
      include: ['src/**/*.integration.test.ts'],
      fileParallelism: false, // IMPORTANTE: ver Passo 7
      hookTimeout: 30_000, // migrations + bcrypt podem demorar
      testTimeout: 15_000,
      globalSetup: ['./src/tests/global-setup.ts'],
    },
  }
})
