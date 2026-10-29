import fastify, { type FastifyReply, type FastifyRequest } from 'fastify'
import { db } from './db'
import { sql } from 'drizzle-orm'
import { ZodError } from 'zod'
import { userRoutes } from './modules/users/user.routes'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import { env } from './env/env'
import { authRoutes } from './modules/auth/auth.routes'
import { preferencesRoutes } from './modules/preferences/preferences.routes'

const app = fastify({ logger: process.env.NODE_ENV !== 'test' })

app.decorate('db', db)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send(error.issues)
  }

  reply.send(error)
})

app.get('/health', async () => {
  const [rows] = await db.execute(sql`SELECT NOW() AS agora`)

  return { status: 'ok', banco: rows.agora }
})

app.addHook('onClose', async () => {
  await db.$client.end()
})

app.get('/', async (_request, _reply) => {
  return {
    message: 'Template Fastify running...',
  }
})

app.register(fastifyCors, { origin: env.FRONTEND_URL })

app.register(fastifyJwt, { secret: env.JWT_SECRET })

app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Token missing or invalid' })
  }
})

app.register(userRoutes, { prefix: '/users' })
app.register(preferencesRoutes, { prefix: '/users/me' })
app.register(authRoutes, { prefix: '/auth' })

export default app
