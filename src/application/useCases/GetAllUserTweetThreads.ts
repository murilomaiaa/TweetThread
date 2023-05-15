import { TweetThreadRepository } from '../repositories/TweetThreadRepository'

type GetAllUserTweetThreadsProps = {
  userId: string
}

export class GetAllUserTweetThreads {
  constructor(private readonly tweetThreadsRepository: TweetThreadRepository) {}

  public async handle({ userId }: GetAllUserTweetThreadsProps) {
    const threads = await this.tweetThreadsRepository.findByUserId(userId)
    return { threads }
  }
}
