import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least 1 number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least 1 special character'),
})

export type CreateUserBody = z.infer<typeof createUserSchema>
