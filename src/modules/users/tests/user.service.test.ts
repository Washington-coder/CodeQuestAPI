import { describe, it, expect, vi } from 'vitest'
import { createUserService } from './../user.service'

describe('Register User', () => {
  it('Creates a hash from the password with 12 rounds and puts it on the repository', async () => {
    const hash = vi.fn().mockResolvedValue('HASH_FAKE')
    const createUser = vi.fn().mockResolvedValue({ id: '1', name: 'Ana', email: 'a@b.com' })
    const registerUser = createUserService({ hash, createUser })

    const result = await registerUser({ name: 'Ana', email: 'a@b.com', password: 'senha#123' })

    expect(hash).toHaveBeenCalledWith('senha#123', 12)
    expect(createUser).toHaveBeenCalledWith({
      name: 'Ana',
      email: 'a@b.com',
      passwordHash: 'HASH_FAKE',
    })
    expect(result.email).toBe('a@b.com')
  })

  it('Never pass password that has not been hashed to the repository', async () => {
    const hash = vi.fn().mockResolvedValue('HASH_FAKE')
    const createUser = vi.fn().mockResolvedValue({ id: '1', name: 'Ana', email: 'a@b.com' })
    await createUserService({ hash, createUser })({
      name: 'Ana',
      email: 'a@b.com',
      password: 'senha#123',
    })

    expect(JSON.stringify(createUser.mock.calls)).not.toContain('senha#123')
  })
})
