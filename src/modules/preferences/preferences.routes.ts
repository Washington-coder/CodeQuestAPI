import { type FastifyInstance } from 'fastify'
import { createPreferencesService } from './preferences.service'
import { db } from '../../db'
import { type NewUserPreferences, userPreferences } from '../../db/schema'
import { savePreferencesSchema } from './preferences.schema'

export function preferencesRoutes(app: FastifyInstance) {
  const save = createPreferencesService({
    upsert: async (userId, data) => {
      const [row] = await db
        .insert(userPreferences)
        .values({
          userId,
          languages: data.languages,
          frameworks: data.frameworks,
          focus: data.focus,
          interfaceLanguage: data.interfaceLanguage,
        })
        .onConflictDoUpdate({
          target: userPreferences.userId,
          set: {
            languages: data.languages,
            frameworks: data.frameworks,
            focus: data.focus,
            interfaceLanguage: data.interfaceLanguage,
            updatedAt: new Date(),
          },
        })
        .returning()
      return row
    },
  })

  app.put('/preferences', { onRequest: [app.authenticate] }, async (request, reply) => {
    const body = savePreferencesSchema.parse(request.body)
    const userId = request.user.sub

    const saved = await save(userId, body)

    return reply.status(200).send({
      languages: saved.languages,
      frameworks: saved.frameworks,
      focus: saved.focus,
      interfaceLanguage: saved.interfaceLanguage,
    })
  })
}
