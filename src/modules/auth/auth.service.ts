import { type User } from '../../db/schema'
import { type LoginSchemaBody } from './auth.schema'

type AuthDeps = {
  findUserByEmail: (email: string) => Promise<User | null>
  comparePassword: (plain: string, hash: string) => Promise<boolean>
  signToken: (userId: string) => string
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid crendentials')
    this.name = 'InvalidCredentialsError'
  }
}

export function createAuthService(deps: AuthDeps) {
  return async function login(input: LoginSchemaBody) {
    const user = await deps.findUserByEmail(input.email)

    if (!user || !user.passwordHash) {
      throw new InvalidCredentialsError()
    }

    const passwordMatches = await deps.comparePassword(input.password, user.passwordHash)

    if (!passwordMatches) {
      throw new InvalidCredentialsError()
    }

    const token = deps.signToken(user.id)

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    }
  }
}
