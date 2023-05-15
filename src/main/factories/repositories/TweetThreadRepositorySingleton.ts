import { TweetThreadRepository } from '@/application/repositories/TweetThreadRepository'
import { MongodbTweetThreadRepository } from '@/infra/mongodb/repositories/MongodbTweetThreadRepository'

export class TweetThreadRepositorySingleton {
  private static instance: TweetThreadRepository

  private constructor() {}

  public static getInstance(): TweetThreadRepository {
    if (!TweetThreadRepositorySingleton.instance) {
      TweetThreadRepositorySingleton.instance =
        new MongodbTweetThreadRepository()
    }
    return TweetThreadRepositorySingleton.instance
  }
}
