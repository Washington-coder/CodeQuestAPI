import { type UserPreferences } from '../../db/schema'
import { type SavePreferencesBody } from './preferences.schema'

export type PreferencesDeps = {
  upsert: (userId: string, data: SavePreferencesBody) => Promise<UserPreferences>
}

export function createPreferencesService(deps: PreferencesDeps) {
  return async function savePreferences(userId: string, input: SavePreferencesBody) {
    return deps.upsert(userId, input)
  }
}
