import { TweetThread } from '@/domain/entities/TweetThread'

export interface TweetThreadRepository {
  create(tweetThread: TweetThread): Promise<void>
}
