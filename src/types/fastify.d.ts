import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type * as schema from '../db/schema'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<unknown>
    db: PostgresJsDatabase<typeof schema>
  }
}
