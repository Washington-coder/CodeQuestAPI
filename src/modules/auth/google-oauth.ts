import axios from 'axios'
import { env } from '../../env/env'
import { type GoogleUserInfo, type GoogleTokenResponse } from './types/google-types'
import { OAuth2Client, type TokenPayload } from 'google-auth-library'

export async function exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {
  const response = await axios.post<GoogleTokenResponse>('https://oauth2.googleapis.com/token', {
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  })

  return response.data
}

export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await axios.get<GoogleUserInfo>(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )

  return response.data
}

export async function verifyGoogleToken(idToken: string): Promise<TokenPayload | undefined> {
  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID)

  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  })

  const payload = ticket.getPayload()

  return payload
}
