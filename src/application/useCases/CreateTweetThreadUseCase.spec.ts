import { CreateTweetThreadUseCase } from './CreateTweetThreadUseCase'
import { UserRepository } from '../repositories/UserRepository'
import { makeFakeUser } from '@/domain/entities/__test__/helpers/makeFakeUser'
import { UserNotFoundError } from '../errors/UserNotFoundError'
import { Id } from '@/domain/entities/valueObjects/Id'
import { ThreadGenerator } from '../gateways/ThreadGenerator'
import { TweetThreadRepository } from '../repositories/TweetThreadRepository'
import { TweetThread } from '@/domain/entities/TweetThread'

vi.mock('node:crypto', () => ({
  randomUUID() {
    return '8f8519f0-fd6b-4f6f-a366-ebf226fc5f61'
  },
}))

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

  const tweetThreadRepository: TweetThreadRepository = {
    async create(tweetThread) {},
  }

  beforeEach(() => {
    systemUnderTests = new CreateTweetThreadUseCase(
      userRepository,
      threadGenerator,
      tweetThreadRepository,
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

  it('should call TweetThreadRepository with correct args', async () => {
    const owner = makeFakeUser()
    vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(owner)
    const tweets = ['1/2 generated thread', '2/2 generated thread']
    vi.spyOn(threadGenerator, 'generate').mockResolvedValueOnce(tweets)
    const createSpy = vi.spyOn(tweetThreadRepository, 'create')

    await systemUnderTests.handle({
      transcript: 'any very good transcript',
      userId: 'any-valid-id',
    })

    const tweetThread = TweetThread.create({
      owner,
      tweets,
      transcript: 'any very good transcript',
    })
    expect(createSpy).toHaveBeenCalledOnce()
    expect(createSpy).toHaveBeenCalledWith(tweetThread)
  })
})
