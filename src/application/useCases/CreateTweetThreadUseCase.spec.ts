import { CreateTweetThreadUseCase } from './CreateTweetThreadUseCase'
import { UserRepository } from '../repositories/UserRepository'
import { makeFakeUser } from '@/domain/entities/__test__/helpers/makeFakeUser'
import { UserNotFoundError } from '../errors/UserNotFoundError'
import { Id } from '@/domain/entities/valueObjects/Id'

describe('CreateTweetThread', () => {
  let systemUnderTests: CreateTweetThreadUseCase
  const userRepository: UserRepository = {
    async findById(id) {
      return makeFakeUser({}, id)
    },
  }

  beforeEach(() => {
    systemUnderTests = new CreateTweetThreadUseCase(userRepository)
  })

  it('should throw if user is undefined', async () => {
    const findByIdSpy = vi
      .spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(undefined)

    const promise = systemUnderTests.handle({
      transcript: 'any generated transcript',
      userId: 'any-valid-id',
    })

    expect(findByIdSpy).toHaveBeenCalledOnce()
    expect(findByIdSpy).toHaveBeenCalledWith(new Id('any-valid-id'))
    await expect(promise).rejects.toEqual(new UserNotFoundError())
  })
})
