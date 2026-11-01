export const errorResponseSchema = {
  $id: 'ErrorResponse',
  type: 'object',
  description: 'Erro genérico da API',
  properties: {
    message: { type: 'string', example: 'Token missing or invalid' },
  },
  required: ['message'],
} as const

export const validationErrorSchema = {
  $id: 'ValidationError',
  type: 'object',
  description: 'Erro de validação do body/query',
  properties: {
    message: { type: 'string', example: 'body/email must match format "email"' },
  },
} as const
