import { CreateTweetThread } from './CreateTweetThread'
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
  let systemUnderTests: CreateTweetThread
  const userRepository = {
    async findById(id) {
      return makeFakeUser({}, new Id(id))
    },
  } as UserRepository
  const threadGenerator: ThreadGenerator = {
    async generate(transcript) {
      return transcript.split(' ')
    },
  }

  const tweetThreadRepository: TweetThreadRepository = {
    async create(tweetThread) {
      return { generatedId: new Id().toString() }
    },
  }

  beforeEach(() => {
    systemUnderTests = new CreateTweetThread(
      userRepository,
      threadGenerator,
      tweetThreadRepository,
    )
  })
  beforeAll(() => {
    vi.useFakeTimers({
      now: new Date(),
    })
  })
  afterAll(() => {
    vi.useRealTimers()
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
    expect(findByIdSpy).toHaveBeenCalledWith('any-valid-id')
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
    const user = makeFakeUser()
    vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(user)
    const tweets = ['1/2 generated thread', '2/2 generated thread']
    vi.spyOn(threadGenerator, 'generate').mockResolvedValueOnce(tweets)
    const createSpy = vi.spyOn(tweetThreadRepository, 'create')

    await systemUnderTests.handle({
      transcript: 'any very good transcript',
      userId: 'any-valid-id',
    })

    const tweetThread = TweetThread.create({
      userId: new Id(user.id),
      tweets,
      transcript: 'any very good transcript',
    })
    expect(createSpy).toHaveBeenCalledOnce()
    expect(createSpy).toHaveBeenCalledWith(tweetThread)
  })

  it('should return the generated tweets', async () => {
    const result = await systemUnderTests.handle({
      transcript: 'any very good transcript',
      userId: 'any-valid-id',
    })

    expect(result).toEqual({ tweets: ['any', 'very', 'good', 'transcript'] })
  })
})
