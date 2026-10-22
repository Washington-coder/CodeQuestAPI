import { type FastifyInstance } from 'fastify'
import { createAuthService, InvalidCredentialsError } from './auth.service'
import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { env } from '../../env/env'
import { loginSchema } from './auth.schema'

export function authRoutes(app: FastifyInstance) {
  const authService = createAuthService({
    findUserByEmail: async (email) => {
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
      return user ?? null
    },
    comparePassword: bcrypt.compare,
    signToken: (userId) => app.jwt.sign({ sub: userId }, { expiresIn: env.JWT_EXPIRES_IN }),
  })

  app.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body)

    try {
      const result = await authService(body)
      return await reply.status(200).send(result)
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(401).send({ message: 'Invalid crendentials' })
      }
      throw error
    }
  })
}
