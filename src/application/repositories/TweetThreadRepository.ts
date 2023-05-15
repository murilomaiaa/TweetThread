import { TweetThread } from '@/domain/entities/TweetThread'
import { CreateEntityOutput } from './types/CreateEntityOutput'

export interface TweetThreadRepository {
  create(tweetThread: TweetThread): Promise<CreateEntityOutput>
  findByOwnerId(ownerId: string): Promise<TweetThread[]>
}
