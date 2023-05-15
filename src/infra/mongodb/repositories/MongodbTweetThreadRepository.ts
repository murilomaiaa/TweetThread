import { TweetThreadRepository } from '@/application/repositories/TweetThreadRepository'
import { TweetThread } from '@/domain/entities/TweetThread'
import { MongoHelper } from '../MongoHelper'
import { Collection, ObjectId } from 'mongodb'
import { TweetThreadMapper } from '../Mappers/TweetThreadMapper'
import { CreateEntityOutput } from '@/application/repositories/types/CreateEntityOutput'

export type MongodbTweetThread = {
  _id: ObjectId
  userId: ObjectId
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

  async findByUserId(userId: string): Promise<TweetThread[]> {
    const userIdObject = new ObjectId(userId)
    const tweetThreads = await this.collection
      .find({ userId: userIdObject })
      .toArray()
    return tweetThreads.map((thread) => this.mapper.toEntity(thread))
  }

  async create(thread: TweetThread): Promise<CreateEntityOutput> {
    const { createdAt, userId, transcript, tweets, updatedAt } = thread
    const _id = new ObjectId()
    const mongodbTweetThread: MongodbTweetThread = {
      _id,
      createdAt,
      transcript,
      tweets,
      updatedAt,
      userId: new ObjectId(userId.toString()),
    }
    await Promise.all([
      await this.collection.insertOne(mongodbTweetThread),
      await MongoHelper.getCollection('users').updateOne(
        { _id: new ObjectId(userId.toString()) },
        { $push: { savedTweetThreads: new ObjectId(_id) } },
      ),
    ])
    return {
      generatedId: _id.toHexString(),
    }
  }
}
