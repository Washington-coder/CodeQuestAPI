import 'dotenv/config'
import { env } from './env/env'
import app from './app'

const start = async () => {
  try {
    await app.ready()
    await app.listen({ port: Number(env.PORT) })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

void start()
