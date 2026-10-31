import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import app from '../../../app'
import { db } from '../../../db'
import { users } from '../../../db/schema'
import { ROUTES } from '../../../constants/routes'
import { type CreateUserBody } from '../user.schema'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(async () => {
  await db.delete(users)
})

const payload: CreateUserBody = { name: 'Ana', email: 'ana@teste.com', password: 'senha#123' }

describe('POST /users', () => {
  it('creates the user and return 201 with hashed password', async () => {
    const res = await app.inject({ method: 'POST', url: ROUTES.USERS.CREATE, payload })

    expect(res.statusCode).toBe(201)
    expect(res.json()).toEqual({
      id: expect.any(String) as string,
      name: 'Ana',
      email: 'ana@teste.com',
    })
    expect(res.json()).not.toHaveProperty('passwordHash')
  })

  it('grava a senha como hash bcrypt no banco, nunca em texto puro', async () => {
    await app.inject({ method: 'POST', url: ROUTES.USERS.CREATE, payload })

    const [row] = await db.select().from(users)
    expect(row).toBeDefined()
    expect(row?.passwordHash).toMatch(/^\$2[aby]\$12\$/)
    expect(row?.passwordHash).not.toContain('senha#123')
  })

  it('devolve 409 para email duplicado', async () => {
    await app.inject({ method: 'POST', url: ROUTES.USERS.CREATE, payload })
    const res = await app.inject({ method: 'POST', url: ROUTES.USERS.CREATE, payload })

    expect(res.statusCode).toBe(409)
    expect(res.json()).toEqual({ message: 'Email já cadastrado' })
  })

  it('devolve 400 para senha fora da BR-01', async () => {
    const res = await app.inject({
      method: 'POST',
      url: ROUTES.USERS.CREATE,
      payload: { ...payload, password: 'senha1234' }, // sem caractere especial
    })

    expect(res.statusCode).toBe(400)
  })

  it('devolve 400 para email inválido', async () => {
    const res = await app.inject({
      method: 'POST',
      url: ROUTES.USERS.CREATE,
      payload: { ...payload, email: 'nao-email' },
    })

    expect(res.statusCode).toBe(400)
  })

  it('não cria usuário quando a validação falha', async () => {
    await app.inject({
      method: 'POST',
      url: ROUTES.USERS.CREATE,
      payload: { ...payload, password: 'fraca' },
    })

    const rows = await db.select().from(users)
    expect(rows).toHaveLength(0)
  })
})
