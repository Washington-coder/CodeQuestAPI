import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  passwordHash: text('password_hash'),
  googleId: text('google_id').unique(),
})

export const userPreferences = pgTable('user_preferences', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  languages: text('languages').array().notNull().default([]),
  frameworks: text('frameworks').array().notNull().default([]),
  focus: text('focus').array().notNull().default([]),
  interfaceLanguage: text('interface_language').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect // linha retornada num SELECT
export type NewUser = typeof users.$inferInsert // objeto aceito num INSERT
export type UserPreferences = typeof userPreferences.$inferSelect
export type NewUserPreferences = typeof userPreferences.$inferInsert
