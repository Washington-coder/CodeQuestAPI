import fastify from 'fastify'
import { db } from './db'
import { sql } from 'drizzle-orm'
import { ZodError } from 'zod'
import { userRoutes } from './modules/users/user.routes'
import fastifyJwt from '@fastify/jwt'
import { env } from './env/env'
import { authRoutes } from './modules/auth/auth.routes'

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

app.register(fastifyJwt, { secret: env.JWT_SECRET })

app.register(userRoutes, { prefix: '/users' })
app.register(authRoutes, { prefix: '/auth' })

export default app
