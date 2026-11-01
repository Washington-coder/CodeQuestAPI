export const savePreferencesDocs = {
  tags: ['Preferences'],
  summary: 'Salva as preferências de onboarding do usuário',
  description:
    'Operação de upsert: cria na primeira vez e atualiza nas seguintes, sem duplicar a linha. Requer JWT.',
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    required: ['languages', 'frameworks', 'focus', 'interfaceLanguage'],
    properties: {
      languages: {
        type: 'array',
        minItems: 1,
        items: { type: 'string' },
        example: ['TypeScript', 'Python'],
      },
      frameworks: {
        type: 'array',
        minItems: 1,
        items: { type: 'string' },
        example: ['React', 'Next.js'],
      },
      focus: {
        type: 'array',
        minItems: 1,
        items: { type: 'string', enum: ['frontend', 'backend', 'fullstack', 'data'] },
        example: ['frontend', 'fullstack'],
      },
      interfaceLanguage: {
        type: 'string',
        enum: ['pt-BR', 'en-US', 'es-ES'],
        example: 'pt-BR',
      },
    },
  },
  response: {
    200: {
      description: 'Preferências salvas',
      type: 'object',
      properties: {
        languages: { type: 'array', items: { type: 'string' } },
        frameworks: { type: 'array', items: { type: 'string' } },
        focus: { type: 'array', items: { type: 'string' } },
        interfaceLanguage: { type: 'string' },
      },
      required: ['languages', 'frameworks', 'focus', 'interfaceLanguage'],
    },
    400: { $ref: 'ValidationError#' },
    401: { $ref: 'ErrorResponse#' },
  },
} as const
