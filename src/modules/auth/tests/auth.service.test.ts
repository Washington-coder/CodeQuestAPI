import { describe, expect, it, vi } from 'vitest'
import { type User } from '../../../db/schema'
import { createAuthService, InvalidCredentialsError } from '../auth.service'

const user: User = {
  id: 'user-1',
  name: 'Ana',
  email: 'ana@teste.com',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  passwordHash: '$2y$12$hash',
}

function makeDeps(overrides: Partial<Parameters<typeof createAuthService>[0]> = {}) {
  const deps = {
    findUserByEmail: vi.fn(() => Promise.resolve(user)),
    comparePassword: vi.fn(() => Promise.resolve(true)),
    signToken: vi.fn(() => 'jwt-token'),
    ...overrides,
  }
  return { deps, login: createAuthService(deps) }
}

describe('login', () => {
  it('retorna token e dados do usuário quando as credenciais conferem', async () => {
    const { deps, login } = makeDeps()
    const result = await login({ email: 'ana@teste.com', password: 'senha#123' })

    expect(result).toEqual({
      token: 'jwt-token',
      user: { id: 'user-1', name: 'Ana', email: 'ana@teste.com' },
    })
    expect(deps.findUserByEmail).toHaveBeenCalledWith('ana@teste.com')
    expect(deps.signToken).toHaveBeenCalledWith('user-1')
  })

  it('lança InvalidCredentialsError quando o email não existe (e NÃO compara senha)', async () => {
    const { deps, login } = makeDeps({
      findUserByEmail: vi.fn(() => Promise.resolve(null)),
    })

    await expect(login({ email: 'x@y.com', password: 'senha#123' })).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
    expect(deps.comparePassword).not.toHaveBeenCalled()
    expect(deps.signToken).not.toHaveBeenCalled()
  })

  it('lança InvalidCredentialsError quando a senha está errada', async () => {
    const { deps, login } = makeDeps({
      comparePassword: vi.fn(() => Promise.resolve(false)),
    })

    await expect(login({ email: 'ana@teste.com', password: 'errada' })).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
    expect(deps.signToken).not.toHaveBeenCalled()
  })
})
