import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  passwordHash: text('password_hash'),
  googleId: text('google_id').unique(),
})

// Tipos inferidos da tabela — nunca duplicar manualmente (DRY)
export type User = typeof users.$inferSelect // linha retornada num SELECT
export type NewUser = typeof users.$inferInsert // objeto aceito num INSERT
