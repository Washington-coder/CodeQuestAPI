export const loginDocs = {
  tags: ['Auth'],
  summary: 'Login com email e senha',
  description: 'Valida as credenciais e devolve um JWT para usar nas rotas protegidas.',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'washington@example.com' },
      password: { type: 'string', minLength: 1, maxLength: 100, example: 'senha#123' },
    },
  },
  response: {
    200: {
      description: 'Autenticado com sucesso',
      type: 'object',
      properties: {
        token: { type: 'string', description: 'JWT para o header Authorization' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Washington' },
            email: { type: 'string', format: 'email' },
          },
          required: ['id', 'name', 'email'],
        },
      },
      required: ['token', 'user'],
    },
    400: { $ref: 'ValidationError#' },
    401: { $ref: 'ErrorResponse#' },
  },
} as const

export const googleCallbackDocs = {
  tags: ['Auth'],
  summary: 'Callback do Google OAuth',
  description:
    'Recebe o `code` do Google, troca por tokens, cria ou reaproveita o usuário e redireciona para o frontend com o JWT na query string (`?token=...`).',
  querystring: {
    type: 'object',
    required: ['code'],
    properties: {
      code: { type: 'string', description: 'Authorization code devolvido pelo Google' },
    },
  },
  response: {
    302: { description: 'Redireciona para o frontend com o token', type: 'null' },
    401: { $ref: 'ErrorResponse#' },
  },
} as const
