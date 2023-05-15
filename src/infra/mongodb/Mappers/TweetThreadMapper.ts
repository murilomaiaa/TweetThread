import { TweetThread } from '@/domain/entities/TweetThread'
import { MongodbTweetThread } from '../repositories/MongodbTweetThreadRepository'
import { Id } from '@/domain/entities/valueObjects/Id'

export class TweetThreadMapper {
  toEntity(thread: MongodbTweetThread): TweetThread {
    return TweetThread.create(
      {
        ...thread,
        userId: new Id(thread.userId.toHexString()),
      },
      new Id(thread._id.toHexString()),
    )
  }
}
