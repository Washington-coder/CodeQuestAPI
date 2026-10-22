import { describe, expect, it } from 'vitest'
import { loginSchema } from '../auth.schema'

describe('loginSchema', () => {
  it('accepts a valid body (email and password presents)', () => {
    const result = loginSchema.safeParse({
      email: 'ana@teste.com',
      password: 'senha#123',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ email: 'ana@teste.com', password: 'senha#123' })
    }
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'nao-email', password: 'senha#123' })

    expect(result.success).toBe(false)
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'ana@teste.com', password: '' })

    expect(result.success).toBe(false)
  })

  it('rejects password with more than 100 length', () => {
    const result = loginSchema.safeParse({
      email: 'ana@teste.com',
      password: 'a'.repeat(101),
    })

    expect(result.success).toBe(false)
  })

  it('rejects body if it does not have email field', () => {
    const result = loginSchema.safeParse({
      password: 'senha#123',
    })

    expect(result.success).toBe(false)
  })

  it('rejects body if it does not have password field', () => {
    const result = loginSchema.safeParse({
      email: 'ana@teste.com',
    })

    expect(result.success).toBe(false)
  })
})
