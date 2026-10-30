import { describe, expect, it } from 'vitest'
import { savePreferencesSchema } from '../preferences.schema'

const validBody = {
  languages: ['JavaScript', 'TypeScript'],
  frameworks: ['React', 'Node.js'],
  focus: ['frontend'],
  interfaceLanguage: 'pt-BR',
}

describe('savePreferencesSchema', () => {
  it('aceita um body válido e devolve os dados normalizados', () => {
    const result = savePreferencesSchema.safeParse(validBody)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validBody)
    }
  })

  it('rejeita quando languages está vazio', () => {
    const result = savePreferencesSchema.safeParse({ ...validBody, languages: [] })

    expect(result.success).toBe(false)
  })

  it('rejeita quando languages não é enviada', () => {
    const result = savePreferencesSchema.safeParse({
      frameworks: validBody.frameworks,
      focus: validBody.focus,
      interfaceLanguage: validBody.interfaceLanguage,
    })

    expect(result.success).toBe(false)
  })

  it('rejeita quando frameworks está vazio', () => {
    const result = savePreferencesSchema.safeParse({ ...validBody, frameworks: [] })

    expect(result.success).toBe(false)
  })

  it('rejeita quando focus está vazio', () => {
    const result = savePreferencesSchema.safeParse({ ...validBody, focus: [] })

    expect(result.success).toBe(false)
  })

  it('rejeita valor fora do enum de focus', () => {
    const result = savePreferencesSchema.safeParse({ ...validBody, focus: ['devops'] })

    expect(result.success).toBe(false)
  })

  it('rejeita idioma fora do enum de interfaceLanguage', () => {
    const result = savePreferencesSchema.safeParse({ ...validBody, interfaceLanguage: 'fr-FR' })

    expect(result.success).toBe(false)
  })

  it('rejeita quando interfaceLanguage não é enviada', () => {
    const result = savePreferencesSchema.safeParse({
      languages: validBody.languages,
      frameworks: validBody.frameworks,
      focus: validBody.focus,
    })

    expect(result.success).toBe(false)
  })
})
