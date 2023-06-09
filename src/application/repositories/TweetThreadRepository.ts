import { TweetThread } from '@/domain/entities/TweetThread'
import { CreateEntityOutput } from './types/CreateEntityOutput'

export interface TweetThreadRepository {
  create(tweetThread: TweetThread): Promise<CreateEntityOutput>
  findByUserId(userId: string): Promise<TweetThread[]>
}
