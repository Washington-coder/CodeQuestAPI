import fastify, { type FastifyError, type FastifyReply, type FastifyRequest } from 'fastify'
import { db } from './db'
import { sql } from 'drizzle-orm'
import { ZodError } from 'zod'
import { userRoutes } from './modules/users/user.routes'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import { env } from './env/env'
import { authRoutes } from './modules/auth/auth.routes'
import { preferencesRoutes } from './modules/preferences/preferences.routes'
import { ROUTES } from './constants/routes'
import { registerSwagger } from './config/swagger'
import { errorResponseSchema, validationErrorSchema } from './docs/schemas'
import { healthDocs } from './docs/health.docs'

export async function buildApp() {
  const app = fastify({
    logger: process.env.NODE_ENV !== 'test',
    ajv: {
      customOptions: {
        strict: false,
        keywords: ['example'],
      },
    },
  })

  app.addSchema(errorResponseSchema)
  app.addSchema(validationErrorSchema)

  app.decorate('db', db)

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send(error.issues)
    }

    // Erros de validação do JSON Schema do Fastify (ex.: body inválido) já trazem statusCode 400
    if (error.validation) {
      return reply.status(400).send({ message: error.message })
    }

    reply.send(error)
  })

  // O Swagger precisa ser registrado ANTES das rotas para capturá-las
  if (process.env.NODE_ENV !== 'production') {
    await registerSwagger(app)
  }

  app.get(ROUTES.HEALTH, { schema: healthDocs.health }, async () => {
    const [rows] = await db.execute(sql`SELECT NOW() AS agora`)

    return { status: 'ok', banco: rows.agora }
  })

  app.addHook('onClose', async () => {
    await db.$client.end()
  })

  app.get(ROUTES.ROOT, { schema: healthDocs.root }, async (_request, _reply) => {
    return {
      message: 'Template Fastify running...',
    }
  })

  await app.register(fastifyCors, { origin: env.FRONTEND_URL })

  await app.register(fastifyJwt, { secret: env.JWT_SECRET })

  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch {
      return reply.status(401).send({ message: 'Token missing or invalid' })
    }
  })

  await app.register(userRoutes)
  await app.register(preferencesRoutes)
  await app.register(authRoutes)

  return app
}

export default buildApp
