export interface GoogleTokenResponse {
  access_token: string
  expires_in: number
  id_token: string
  token_type: string
  refresh_token?: string
  scope: string
}

export interface GoogleUserInfo {
  id: string
  email: string
  name: string
  picture?: string
  verified_email?: boolean
  locale?: string
}

export interface GoogleIdTokenPayload {
  sub: string
  email: string
  email_verified: boolean
  name: string
  picture?: string
  iss: string
  aud: string
  exp: number
  iat: number
}
