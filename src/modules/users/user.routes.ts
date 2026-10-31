import bcrypt from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import { db } from '../../db'
import { users } from '../../db/schema'
import { createUserSchema } from './user.schema'
import { ROUTES } from '../../constants/routes'

export function userRoutes(app: FastifyInstance) {
  app.post(ROUTES.USERS.CREATE, async (request, reply) => {
    const body = createUserSchema.parse(request.body)

    const passwordHash = await bcrypt.hash(body.password, 12)

    try {
      const [user] = await db
        .insert(users)
        .values({ name: body.name, email: body.email, passwordHash })
        .returning()

      return await reply.status(201).send({
        id: user.id,
        name: user.name,
        email: user.email,
      })
    } catch (err) {
      if ((err as { cause?: { code?: string } }).cause?.code === '23505') {
        return reply.status(409).send({ message: 'Email já cadastrado' })
      }
      throw err
    }
  })
}
