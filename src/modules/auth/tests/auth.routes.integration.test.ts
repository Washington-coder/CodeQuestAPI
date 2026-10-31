import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import app from '../../../app'
import { db } from '../../../db'
import { users } from '../../../db/schema'
import { ROUTES } from '../../../constants/routes'

// Mocka o módulo de OAuth: não queremos falar com o Google real nos testes.
vi.mock('../google-oauth', () => ({
  exchangeCodeForToken: vi.fn(),
  verifyGoogleToken: vi.fn(),
  getGoogleUserInfo: vi.fn(),
}))

import { exchangeCodeForToken, verifyGoogleToken } from '../google-oauth'

const mockExchange = vi.mocked(exchangeCodeForToken)
const mockVerify = vi.mocked(verifyGoogleToken)

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(async () => {
  await db.delete(users)
  mockExchange.mockReset()
  mockVerify.mockReset()
})

describe('GET /auth/google/callback', () => {
  it('cria o usuário (sem senha) e redireciona com o token JWT na query', async () => {
    mockExchange.mockResolvedValueOnce({ access_token: 'a', id_token: 'id-token' } as never)
    mockVerify.mockResolvedValueOnce({
      sub: 'google-1',
      email: 'ana@gmail.com',
      name: 'Ana',
    } as never)

    const res = await app.inject({
      method: 'GET',
      url: `${ROUTES.AUTH.GOOGLE_CALLBACK}?code=abc`,
    })

    expect(res.statusCode).toBe(302)
    const location = res.headers.location
    expect(location).toContain('http://localhost:3000?token=')

    const [row] = await db.select().from(users)
    expect(row).toBeDefined()
    expect(row?.email).toBe('ana@gmail.com')
    expect(row?.googleId).toBe('google-1')
    expect(row?.passwordHash).toBeNull()
  })

  it('reaproveita o usuário existente em vez de duplicar', async () => {
    await db.insert(users).values({ email: 'ana@gmail.com', name: 'Ana', googleId: 'google-1' })

    mockExchange.mockResolvedValueOnce({ access_token: 'a', id_token: 'id-token' } as never)
    mockVerify.mockResolvedValueOnce({
      sub: 'google-1',
      email: 'ana@gmail.com',
      name: 'Ana',
    } as never)

    const res = await app.inject({
      method: 'GET',
      url: `${ROUTES.AUTH.GOOGLE_CALLBACK}?code=abc`,
    })

    expect(res.statusCode).toBe(302)
    const rows = await db.select().from(users)
    expect(rows).toHaveLength(1)
  })

  it('devolve 401 quando o token do Google é inválido', async () => {
    mockExchange.mockResolvedValueOnce({ access_token: 'a', id_token: 'id-token' } as never)
    mockVerify.mockResolvedValueOnce(undefined)

    const res = await app.inject({
      method: 'GET',
      url: `${ROUTES.AUTH.GOOGLE_CALLBACK}?code=abc`,
    })

    expect(res.statusCode).toBe(401)
    expect(res.json()).toEqual({ message: 'Invalid Google Token' })
  })

  it('devolve 401 quando o email não vem no payload', async () => {
    mockExchange.mockResolvedValueOnce({ access_token: 'a', id_token: 'id-token' } as never)
    mockVerify.mockResolvedValueOnce({ sub: 'google-1', name: 'Ana' } as never)

    const res = await app.inject({
      method: 'GET',
      url: `${ROUTES.AUTH.GOOGLE_CALLBACK}?code=abc`,
    })

    expect(res.statusCode).toBe(401)
  })
})
