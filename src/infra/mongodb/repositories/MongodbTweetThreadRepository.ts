import { TweetThreadRepository } from '@/application/repositories/TweetThreadRepository'
import { TweetThread } from '@/domain/entities/TweetThread'
import { Id } from '@/domain/entities/valueObjects/Id'
import { MongoHelper } from '../MongoHelper'
import { Collection, ObjectId } from 'mongodb'
import { TweetThreadMapper } from '../Mappers/TweetThreadMapper'
import { CreateEntityOutput } from '@/application/repositories/types/CreateEntityOutput'

export type MongodbTweetThread = {
  _id: ObjectId
  ownerId: ObjectId
  transcript: string
  tweets: string[]
  createdAt: Date
  updatedAt: Date
}

export class MongodbTweetThreadRepository implements TweetThreadRepository {
  private mapper: TweetThreadMapper
  private collection: Collection<MongodbTweetThread>
  public static collection = 'tweetThreads'

  constructor() {
    this.mapper = new TweetThreadMapper()
    this.collection = MongoHelper.getCollection<MongodbTweetThread>(
      MongodbTweetThreadRepository.collection,
    )
  }

  async create(thread: TweetThread): Promise<CreateEntityOutput> {
    const { createdAt, ownerId, transcript, tweets, updatedAt } = thread
    const _id = new ObjectId()
    const mongodbTweetThread: MongodbTweetThread = {
      _id,
      createdAt,
      transcript,
      tweets,
      updatedAt,
      ownerId: new ObjectId(ownerId.toString()),
    }
    await this.collection.insertOne(mongodbTweetThread)
    return {
      generatedId: new Id(_id.toString()),
    }
  }
}
