import { CreateTweetThreadUseCase } from './CreateTweetThreadUseCase'
import { UserRepository } from '../repositories/UserRepository'
import { makeFakeUser } from '@/domain/entities/__test__/helpers/makeFakeUser'
import { UserNotFoundError } from '../errors/UserNotFoundError'
import { Id } from '@/domain/entities/valueObjects/Id'
import { ThreadGenerator } from '../geteways/ThreadGenerator'

describe('CreateTweetThread', () => {
  let systemUnderTests: CreateTweetThreadUseCase
  const userRepository: UserRepository = {
    async findById(id) {
      return makeFakeUser({}, id)
    },
  }
  const threadGenerator: ThreadGenerator = {
    async generate(transcript) {
      return transcript.split(' ')
    },
  }

  beforeEach(() => {
    systemUnderTests = new CreateTweetThreadUseCase(
      userRepository,
      threadGenerator,
    )
  })

  it('should throw if user is undefined', async () => {
    const findByIdSpy = vi
      .spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(undefined)

    const promise = systemUnderTests.handle({
      transcript: 'any very good transcript',
      userId: 'any-valid-id',
    })

    expect(findByIdSpy).toHaveBeenCalledOnce()
    expect(findByIdSpy).toHaveBeenCalledWith(new Id('any-valid-id'))
    await expect(promise).rejects.toEqual(new UserNotFoundError())
  })

  it('should call ThreadGenerator with correct args', async () => {
    const generateSpy = vi.spyOn(threadGenerator, 'generate')

    await systemUnderTests.handle({
      transcript: 'any very good transcript',
      userId: 'any-valid-id',
    })

    expect(generateSpy).toHaveBeenCalledOnce()
    expect(generateSpy).toHaveBeenCalledWith('any very good transcript')
  })
})
