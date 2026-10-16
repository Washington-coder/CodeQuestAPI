import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is missing!')
    .url('DATABASE_URL needs  to be valid!'),
  PORT: z.coerce.number().int().positive().default(3333),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('invalid environment variables', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
