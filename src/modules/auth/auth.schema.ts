import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(100),
})

export type LoginSchemaBody = z.infer<typeof loginSchema>
