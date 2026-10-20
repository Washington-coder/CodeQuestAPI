import { describe, it, expect } from 'vitest'
import { type CreateUserBody, createUserSchema } from './../user.schema'

describe('createUserSchema', () => {
  const valid: CreateUserBody = { name: 'Ana', email: 'ana@example.com', password: 'senha#123' }

  it('Accept valid data', () => {
    expect(createUserSchema.safeParse(valid).success).toBe(true)
  })

  it('Rejects password with less than 8 characters', () => {
    const result = createUserSchema.safeParse({ ...valid, password: 'a#1' })
    expect(result.success).toBe(false)
  })

  it('Rejects password with no numbers in it', () => {
    const result = createUserSchema.safeParse({ ...valid, password: 'senha#abc' })
    expect(result.success).toBe(false)
  })

  it('Rejects password with no special character', () => {
    const result = createUserSchema.safeParse({ ...valid, password: 'senha123' })
    expect(result.success).toBe(false)
  })

  it('Rejects invalid email', () => {
    const result = createUserSchema.safeParse({
      ...valid,
      email: 'invalid-email',
    })

    expect(result.success).toBe(false)
  })
})
