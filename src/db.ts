import { Pool } from 'pg'
import { env } from './env/env.js'

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

process.on('SIGINT', () => {
  void pool.end()
})
