import fastify from 'fastify'
import { db } from './db'
import { sql } from 'drizzle-orm'
import { ZodError } from 'zod'
import { userRoutes } from './modules/users/user.routes'

const app = fastify({ logger: true })

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

app.register(userRoutes, { prefix: '/users' })

export default app
