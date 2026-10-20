export type UserDeps = {
  hash: (password: string, rounds: number) => Promise<string>
  createUser: (data: {
    name: string
    email: string
    passwordHash: string
  }) => Promise<{ id: string; name: string; email: string }>
}

export function createUserService(deps: UserDeps) {
  return async function registerUser(input: { name: string; email: string; password: string }) {
    const passwordHash = await deps.hash(input.password, 12)
    return deps.createUser({ name: input.name, email: input.email, passwordHash })
  }
}
