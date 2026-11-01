export const createUserDocs = {
  tags: ['Users'],
  summary: 'Cadastra um novo usuário',
  description:
    'Cria o usuário com senha hasheada em bcrypt (12 rounds). A senha precisa ter no mínimo 8 caracteres, 1 número e 1 caractere especial.',
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100, example: 'Washington' },
      email: { type: 'string', format: 'email', example: 'washington@example.com' },
      password: {
        type: 'string',
        minLength: 8,
        description: 'Mín. 8 caracteres, 1 número e 1 caractere especial',
        example: 'senha#123',
      },
    },
  },
  response: {
    201: {
      description: 'Usuário criado',
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', example: 'Washington' },
        email: { type: 'string', format: 'email', example: 'washington@example.com' },
      },
      required: ['id', 'name', 'email'],
    },
    400: { $ref: 'ValidationError#' },
    409: { $ref: 'ErrorResponse#' },
  },
} as const
