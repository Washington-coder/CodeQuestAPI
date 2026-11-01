import 'dotenv/config'
import { env } from './env/env'
import { buildApp } from './app'

const start = async () => {
  try {
    const app = await buildApp()
    await app.ready()
    await app.listen({ port: Number(env.PORT) })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

void start()
