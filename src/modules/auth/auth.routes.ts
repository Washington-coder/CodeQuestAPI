import { type FastifyInstance } from 'fastify'
import { createAuthService, InvalidCredentialsError } from './auth.service'
import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { env } from '../../env/env'
import { loginSchema } from './auth.schema'
import { type FastifyReply } from 'fastify/types/reply'
import { type FastifyRequest } from 'fastify/types/request'
import { exchangeCodeForToken, verifyGoogleToken } from './google-oauth'

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

  app.get<{ Querystring: { code: string } }>(
    '/google/callback',
    async (request: FastifyRequest<{ Querystring: { code: string } }>, reply: FastifyReply) => {
      const { code } = request.query

      const tokens = await exchangeCodeForToken(code)
      const googleUser = await verifyGoogleToken(tokens.id_token)

      if (!googleUser?.email || !googleUser.sub) {
        return reply.status(401).send({ message: 'Invalid Google Token' })
      }

      const name = googleUser.name ?? googleUser.email.split('@')[0]

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, googleUser.email))
        .limit(1)

      const user =
        existingUser ??
        (
          await db
            .insert(users)
            .values({ email: googleUser.email, name, googleId: googleUser.sub })
            .returning()
        )[0]

      const token = app.jwt.sign({ sub: user.id }, { expiresIn: env.JWT_EXPIRES_IN })

      return reply.redirect(`${env.FRONTEND_URL}?token=${token}`)
    },
  )
}
