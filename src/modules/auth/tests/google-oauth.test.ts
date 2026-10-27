import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import type { TokenPayload } from 'google-auth-library'
import { exchangeCodeForToken, getGoogleUserInfo, verifyGoogleToken } from '../google-oauth'
import { env } from '../../../env/env'

// Spy de verifyIdToken: controlado pelos testes abaixo.
const verifyIdToken = vi.fn()

vi.mock('google-auth-library', () => ({
  OAuth2Client: class {
    verifyIdToken = verifyIdToken
  },
}))

vi.mock('axios')

const mockPost = vi.spyOn(axios, 'post')
const mockGet = vi.spyOn(axios, 'get')

describe('exchangeCodeForToken', () => {
  beforeEach(() => {
    mockPost.mockReset()
  })

  it('troca o code pelos tokens enviando as credenciais corretas ao Google', async () => {
    const mockTokens = {
      access_token: 'access-123',
      expires_in: 3599,
      id_token: 'id-token-123',
      token_type: 'Bearer',
      scope: 'openid email profile',
    }

    mockPost.mockResolvedValueOnce({ data: mockTokens })

    const result = await exchangeCodeForToken('code-abc')

    expect(mockPost).toHaveBeenCalledWith('https://oauth2.googleapis.com/token', {
      code: 'code-abc',
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    })
    expect(result).toEqual(mockTokens)
  })
})

describe('getGoogleUserInfo', () => {
  beforeEach(() => {
    mockGet.mockReset()
  })

  it('busca os dados do usuário com o access_token no header Authorization', async () => {
    const mockUser = {
      id: 'google-1',
      email: 'ana@gmail.com',
      name: 'Ana',
      picture: 'https://...',
    }

    mockGet.mockResolvedValueOnce({ data: mockUser })

    const result = await getGoogleUserInfo('access-123')

    expect(mockGet).toHaveBeenCalledWith('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: 'Bearer access-123' },
    })
    expect(result).toEqual(mockUser)
  })
})

describe('verifyGoogleToken', () => {
  beforeEach(() => {
    verifyIdToken.mockReset()
  })

  it('valida o id_token e retorna o payload decodificado', async () => {
    const fakePayload: TokenPayload = {
      iss: 'accounts.google.com',
      sub: 'google-1',
      email: 'ana@gmail.com',
      email_verified: true,
      name: 'Ana',
      aud: env.GOOGLE_CLIENT_ID,
      iat: 1700000000,
      exp: 1700003600,
    }

    verifyIdToken.mockResolvedValueOnce({ getPayload: () => fakePayload })

    const result = await verifyGoogleToken('id-token-123')

    expect(verifyIdToken).toHaveBeenCalledWith({
      idToken: 'id-token-123',
      audience: env.GOOGLE_CLIENT_ID,
    })
    expect(result).toEqual(fakePayload)
  })

  it('retorna undefined quando o payload é inexistente', async () => {
    verifyIdToken.mockResolvedValueOnce({ getPayload: () => undefined })

    const result = await verifyGoogleToken('id-token-invalido')

    expect(result).toBeUndefined()
  })
})
