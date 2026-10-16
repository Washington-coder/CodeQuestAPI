import 'dotenv/config'
import fastify from 'fastify'
import { db } from './db/index'
import { sql } from 'drizzle-orm'
import { env } from './env/env'

const app = fastify({ logger: true })

app.decorate('db', db)

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

const start = async () => {
  try {
    const address = await app.listen({
      port: Number(env.PORT),
      host: '0.0.0.0',
    })

    app.log.info(`🚀 Servidor rodando em: ${address}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

void start()
