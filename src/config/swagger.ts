import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { type FastifyInstance } from 'fastify'

export const SWAGGER_UI_PATH = '/docs'

const STATUS_COLORS = { '2': '#16a34a', '3': '#2563eb', '4': '#dc2626', '5': '#b91c1c' }

const STATUS_THEME_CSS = `
.swagger-ui tr.response td.response-col_status {
  font-weight: 600;
}
${Object.entries(STATUS_COLORS)
  .map(
    ([digit, color]) =>
      `.swagger-ui tr.response[data-code^="${digit}"] td.response-col_status { color: ${color}; }`,
  )
  .join('\n')}
`

const STATUS_THEME_JS = `
;(function () {
  const colors = ${JSON.stringify(STATUS_COLORS)}
  const paint = () => {
    document.querySelectorAll('.swagger-ui td.response-col_status').forEach((td) => {
      const color = colors[td.textContent.trim().charAt(0)]
      if (color && td.style.color !== color) td.style.color = color
    })
  }
  paint()
  new MutationObserver(paint).observe(document.documentElement, { childList: true, subtree: true })
})()
`

export async function registerSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'CodeQuest API',
        description:
          'API da plataforma CodeQuest — onde programadores praticam suas skills respondendo quizzes do seu stack.',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:3333', description: 'Desenvolvimento' }],
      tags: [
        { name: 'Health', description: 'Status da aplicação e do banco' },
        { name: 'Users', description: 'Cadastro de usuários' },
        { name: 'Auth', description: 'Autenticação (email/senha e Google OAuth)' },
        { name: 'Preferences', description: 'Preferências de onboarding do usuário' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Token retornado por POST /auth/login ou pelo callback do Google',
          },
        },
      },
    },
  })

  await app.register(swaggerUi, {
    routePrefix: SWAGGER_UI_PATH,
    theme: {
      css: [{ filename: 'codequest-status.css', content: STATUS_THEME_CSS }],
      js: [{ filename: 'codequest-status.js', content: STATUS_THEME_JS }],
    },
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      persistAuthorization: true,
    },
    staticCSP: true,
  })
}
