import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import app from '../../../app'
import { db } from '../../../db'
import { users, userPreferences } from '../../../db/schema'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(async () => {
  await db.delete(userPreferences)
  await db.delete(users)
})

async function authUser() {
  const [user] = await db
    .insert(users)
    .values({ name: 'Ana', email: 'ana@teste.com', googleId: 'google-1' })
    .returning()
  if (!user) throw new Error('Falha ao criar usuário de teste')
  const token = app.jwt.sign({ sub: user.id })
  return { user, token }
}

const payload = {
  languages: ['JavaScript', 'TypeScript'],
  frameworks: ['React', 'Node.js'],
  focus: ['frontend'],
  interfaceLanguage: 'pt-BR',
}

describe('PUT /users/me/preferences', () => {
  it('devolve 401 quando não há token', async () => {
    const res = await app.inject({ method: 'PUT', url: '/users/me/preferences', payload })

    expect(res.statusCode).toBe(401)
  })

  it('devolve 401 quando o token é inválido', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/users/me/preferences',
      payload,
      headers: { authorization: 'Bearer token-invalido' },
    })

    expect(res.statusCode).toBe(401)
  })

  it('devolve 400 quando o body é inválido', async () => {
    const { token } = await authUser()

    const res = await app.inject({
      method: 'PUT',
      url: '/users/me/preferences',
      payload: { ...payload, languages: [] },
      headers: { authorization: `Bearer ${token}` },
    })

    expect(res.statusCode).toBe(400)
  })

  it('salva as preferências e devolve 200 com os dados salvos', async () => {
    const { user, token } = await authUser()

    const res = await app.inject({
      method: 'PUT',
      url: '/users/me/preferences',
      payload,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual(payload)

    const [row] = await db.select().from(userPreferences)
    expect(row).toBeDefined()
    expect(row?.userId).toBe(user.id)
    expect(row?.languages).toEqual(payload.languages)
    expect(row?.frameworks).toEqual(payload.frameworks)
    expect(row?.focus).toEqual(payload.focus)
    expect(row?.interfaceLanguage).toBe(payload.interfaceLanguage)
  })

  it('atualiza as preferências existentes em vez de duplicar a linha', async () => {
    const { token } = await authUser()
    const updated = { ...payload, languages: ['Python'], interfaceLanguage: 'en-US' }

    await app.inject({
      method: 'PUT',
      url: '/users/me/preferences',
      payload,
      headers: { authorization: `Bearer ${token}` },
    })
    await app.inject({
      method: 'PUT',
      url: '/users/me/preferences',
      payload: updated,
      headers: { authorization: `Bearer ${token}` },
    })

    const rows = await db.select().from(userPreferences)
    expect(rows).toHaveLength(1)
    expect(rows[0]?.languages).toEqual(['Python'])
    expect(rows[0]?.interfaceLanguage).toBe('en-US')
  })
})
