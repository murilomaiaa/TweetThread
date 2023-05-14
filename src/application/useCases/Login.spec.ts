import { Login } from './Login'
import { UserRepository } from '../repositories/UserRepository'
import { makeFakeUser } from '@/domain/entities/__test__/helpers/makeFakeUser'
import { Encoder } from '../gateways/Encoder'
import { TokenManager } from '../gateways/TokenManager'
import { InvalidPassword } from '../errors/InvalidPassword'

const mockId = 'be03a64f-58eb-4df8-8652-ea24cff99cf5'
vi.mock('node:crypto', () => ({
  randomUUID() {
    return mockId
  },
}))

describe('Login', () => {
  let systemUnderTests: Login
  const userRepository = {
    async findByEmail(email: string) {
      return makeFakeUser({ email: `hash:${email}` })
    },
  } as UserRepository

  const encoder = {
    async compare(plain, hashed) {
      return !plain.includes('invalid')
    },
  } as Encoder

  const tokenManager = {
    async sign(info, expiresIn) {
      return `auth-token-${info.id.toString()}`
    },
  } as TokenManager

  beforeEach(() => {
    systemUnderTests = new Login(userRepository, encoder, tokenManager)
  })

  it('should throw if user is undefined', async () => {
    const findByEmailSpy = vi
      .spyOn(userRepository, 'findByEmail')
      .mockResolvedValueOnce(undefined)

    const promise = systemUnderTests.handle({
      email: 'valid@mail.com.br',
      password: 'any-valide-password',
    })

    expect(findByEmailSpy).toHaveBeenCalledOnce()
    expect(findByEmailSpy).toHaveBeenCalledWith('valid@mail.com.br')
    await expect(promise).rejects.toEqual(new InvalidPassword())
  })

  it('should throws on invalid password', async () => {
    const promise = systemUnderTests.handle({
      email: 'valid@mail.com.br',
      password: 'invalid-password',
    })

    await expect(promise).rejects.toEqual(new InvalidPassword())
  })

  it('should return correct data', async () => {
    const result = await systemUnderTests.handle({
      email: 'e@mail.com',
      password: 'password123',
    })

    expect(result).toEqual({ accessToken: `auth-token-${mockId}`, id: mockId })
  })
})
