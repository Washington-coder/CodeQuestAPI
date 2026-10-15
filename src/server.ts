import 'dotenv/config'
import fastify from 'fastify'
import { pool } from './db.js'

const app = fastify({ logger: true })

app.decorate('db', pool)

app.get('/health', async () => {
  const { rows } = await pool.query('SELECT NOW() AS agora')

  return { status: 'ok', banco: rows[0].agora }
})

app.addHook('onClose', async () => {
  await pool.end()
})

app.get('/', async (_request, _reply) => {
  return {
    message: 'Template Fastify running...',
  }
})

const start = async () => {
  try {
    const address = await app.listen({
      port: Number(process.env.PORT) || 3333,
      host: '0.0.0.0',
    })

    app.log.info(`🚀 Servidor rodando em: ${address}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

void start()
