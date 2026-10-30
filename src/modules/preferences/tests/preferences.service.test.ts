import { describe, expect, it, vi } from 'vitest'
import { type UserPreferences } from '../../../db/schema'
import { type SavePreferencesBody } from '../preferences.schema'
import { createPreferencesService } from '../preferences.service'

const input: SavePreferencesBody = {
  languages: ['JavaScript'],
  frameworks: ['React'],
  focus: ['frontend'],
  interfaceLanguage: 'pt-BR',
}

const row: UserPreferences = {
  userId: 'user-1',
  ...input,
  updatedAt: new Date('2026-01-01T00:00:00Z'),
}

function makeDeps(overrides: Partial<Parameters<typeof createPreferencesService>[0]> = {}) {
  const deps = {
    upsert: vi.fn(() => Promise.resolve(row)),
    ...overrides,
  }
  return { deps, savePreferences: createPreferencesService(deps) }
}

describe('savePreferences', () => {
  it('repassa userId e input para o upsert do repositório e devolve o resultado', async () => {
    const { deps, savePreferences } = makeDeps()

    const result = await savePreferences('user-1', input)

    expect(result).toBe(row)
    expect(deps.upsert).toHaveBeenCalledWith('user-1', input)
  })

  it('devolve exatamente o que o upsert retorna, sem transformar nada', async () => {
    const { savePreferences } = makeDeps({
      upsert: vi.fn().mockResolvedValue({ ...row, languages: ['Python'] }),
    })

    const result = await savePreferences('user-1', { ...input, languages: ['Python'] })

    expect(result).toEqual({ ...row, languages: ['Python'] })
  })
})
