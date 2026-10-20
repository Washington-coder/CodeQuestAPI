import { execSync } from 'node:child_process'

export default function setup() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL não definida. Crie o arquivo .env.test na raiz do projeto com a URL do banco de teste.',
    )
  }

  // Proteção: nunca rodar migrations no banco de desenvolvimento por engano
  if (!databaseUrl.includes('_test')) {
    throw new Error(
      `Recusando rodar integração: DATABASE_URL não aponta para um banco de teste (esperado conter "_test").`,
    )
  }

  execSync('npx drizzle-kit migrate', {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
  })
}
