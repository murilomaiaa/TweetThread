import { Id } from '@/domain/entities/valueObjects/Id'
import { UserRepository } from '../repositories/UserRepository'
import { UserNotFoundError } from '../errors/UserNotFoundError'
import { ThreadGenerator } from '../gateways/ThreadGenerator'
import { TweetThreadRepository } from '../repositories/TweetThreadRepository'
import { TweetThread } from '@/domain/entities/TweetThread'

type CreateTweetThreadProps = {
  userId: string
  transcript: string
}

export class CreateTweetThread {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly threadGenerator: ThreadGenerator,
    private readonly tweetThreadsRepository: TweetThreadRepository,
  ) {}

  async handle({ transcript, userId }: CreateTweetThreadProps) {
    const owner = await this.usersRepository.findById(new Id(userId))

    if (owner === undefined) {
      throw new UserNotFoundError()
    }

    const tweets = await this.threadGenerator.generate(transcript)

    const tweetThread = TweetThread.create({
      ownerId: owner.id,
      transcript,
      tweets,
    })

    await this.tweetThreadsRepository.create(tweetThread)

    return { tweets }
  }
}
