import z from 'zod'

const focusEnum = z.enum(['frontend', 'backend', 'fullstack', 'data'])
const interfaceLanguageEnum = z.enum(['pt-BR', 'en-US', 'es-ES'])

export const savePreferencesSchema = z.object({
  languages: z.array(z.string()).min(1),
  frameworks: z.array(z.string()).min(1),
  focus: z.array(focusEnum).min(1),
  interfaceLanguage: interfaceLanguageEnum,
})

export type SavePreferencesBody = z.infer<typeof savePreferencesSchema>
