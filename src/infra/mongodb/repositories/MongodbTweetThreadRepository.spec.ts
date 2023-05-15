import { makeFakeTweetThread } from '@/domain/entities/__test__/helpers/makeFakeTweetThread'
import {
  MongodbTweetThread,
  MongodbTweetThreadRepository,
} from './MongodbTweetThreadRepository'
import { MongoHelper } from '../MongoHelper'
import config from '@/shared/config'
import { ObjectId } from 'mongodb'
import { Id } from '@/domain/entities/valueObjects/Id'

describe('MongodbTweetThreadRepository', () => {
  let systemUnderTests: MongodbTweetThreadRepository

  beforeAll(async () => {
    await MongoHelper.connect(config.mongoUrl ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(() => {
    systemUnderTests = new MongodbTweetThreadRepository()
  })

  it('should create a valid thread', async () => {
    const thread = makeFakeTweetThread({
      ownerId: new Id(new ObjectId().toHexString()),
    })
    const { generatedId } = await systemUnderTests.create(thread)

    const insertedTweetThread = (await MongoHelper.getCollection(
      MongodbTweetThreadRepository.collection,
    ).findOne({
      _id: new ObjectId(generatedId),
    })) as MongodbTweetThread
    expect(insertedTweetThread).toBeDefined()
    expect(insertedTweetThread).toEqual<MongodbTweetThread>({
      _id: new ObjectId(generatedId),
      ownerId: new ObjectId(thread.ownerId.toString()),
      transcript: thread.transcript,
      tweets: thread.tweets,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    })
  })
})
