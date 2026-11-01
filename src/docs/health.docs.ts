export const healthDocs = {
  health: {
    tags: ['Health'],
    summary: 'Verifica o status da API e a conexão com o banco',
    description: 'Executa `SELECT NOW()` no Postgres e devolve o horário do servidor do banco.',
    response: {
      200: {
        description: 'API e banco operacionais',
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          banco: { type: 'string', format: 'date-time', example: '2026-10-31T12:00:00.000Z' },
        },
        required: ['status', 'banco'],
      },
      500: { $ref: 'ErrorResponse#' },
    },
  },
  root: {
    tags: ['Health'],
    summary: 'Mensagem de boas-vindas da API',
    response: {
      200: {
        description: 'API no ar',
        type: 'object',
        properties: { message: { type: 'string', example: 'Template Fastify running...' } },
        required: ['message'],
      },
    },
  },
} as const
