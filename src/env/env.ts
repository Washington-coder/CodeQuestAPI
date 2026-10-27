import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is missing!')
    .url('DATABASE_URL needs  to be valid!'),
  PORT: z.coerce.number().int().positive().default(3333),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string().url({ message: 'Invalid GOOGLE_REDIRECT_URI' }),
  FRONTEND_URL: z
    .string()
    .url({ message: 'Invalid FRONTEND_URL' })
    .default('http://localhost:3000'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('invalid environment variables', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
