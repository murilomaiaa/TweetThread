import { SignUp } from './SignUp'
import { UserRepository } from '../repositories/UserRepository'
import { makeFakeUser } from '@/domain/entities/__test__/helpers/makeFakeUser'
import { Email } from '@/domain/entities/valueObjects/Email'
import { EmailAlreadyInUseError } from '../errors/EmailAlreadyInUseError'
import { Encoder } from '../gateways/Encoder'
import { User } from '@/domain/entities/User'

vi.mock('node:crypto', () => ({
  randomUUID() {
    return '8f8519f0-fd6b-4f6f-a366-ebf226fc5f61'
  },
}))

describe('SignUp', () => {
  let systemUnderTests: SignUp
  const userRepository = {
    async findByEmail(email: string) {
      return undefined
    },
    create(user) {},
  } as UserRepository

  const encoder = {
    async encode(plain) {
      return `hash:${plain}`
    },
  } as Encoder

  beforeEach(() => {
    systemUnderTests = new SignUp(userRepository, encoder)
  })

  it('should throw if user is defined', async () => {
    const findByIdSpy = vi
      .spyOn(userRepository, 'findByEmail')
      .mockImplementationOnce(async (email) =>
        makeFakeUser({ email: email.toString() }),
      )

    const promise = systemUnderTests.handle({
      email: 'valid@mail.com.br',
      password: 'any-valide-password',
    })

    expect(findByIdSpy).toHaveBeenCalledOnce()
    expect(findByIdSpy).toHaveBeenCalledWith('valid@mail.com.br')
    await expect(promise).rejects.toEqual(new EmailAlreadyInUseError())
  })

  it('should save user on database with correct args', async () => {
    const createSpy = vi.spyOn(userRepository, 'create')

    await systemUnderTests.handle({
      email: 'e@mail.com',
      password: 'password123',
    })

    expect(createSpy).toHaveBeenCalledWith(
      User.create({ email: 'e@mail.com', password: 'hash:password123' }),
    )
  })
})
