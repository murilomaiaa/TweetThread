import { makeFakeTweetThread } from '@/domain/entities/__test__/helpers/makeFakeTweetThread'
import {
  MongodbTweetThread,
  MongodbTweetThreadRepository,
} from './MongodbTweetThreadRepository'
import { MongoHelper } from '../MongoHelper'
import config from '@/main/config'
import { ObjectId } from 'mongodb'
import { Id } from '@/domain/entities/valueObjects/Id'
import { MongodbUserRepository } from './MongodbUserRepository'
import { makeFakeUser } from '@/domain/entities/__test__/helpers/makeFakeUser'

describe('MongodbTweetThreadRepository', () => {
  let systemUnderTests: MongodbTweetThreadRepository
  let userRepository: MongodbUserRepository

  beforeAll(async () => {
    await MongoHelper.connect(config.mongoUrl ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(() => {
    userRepository = new MongodbUserRepository()
    systemUnderTests = new MongodbTweetThreadRepository()
  })

  it('should create a valid thread', async () => {
    const thread = makeFakeTweetThread({
      userId: new Id(new ObjectId().toHexString()),
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
      userId: new ObjectId(thread.userId.toString()),
      transcript: thread.transcript,
      tweets: thread.tweets,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    })
  })

  it('should return correct threads', async () => {
    const user1 = makeFakeUser()
    const user2 = makeFakeUser()
    const [id1, id2] = await Promise.all([
      userRepository.create(user1),
      userRepository.create(user2),
    ])
    const [t1, t2, t3] = await Promise.all([
      systemUnderTests.create(
        makeFakeTweetThread({ userId: new Id(id1.generatedId) }),
      ),
      systemUnderTests.create(
        makeFakeTweetThread({ userId: new Id(id2.generatedId) }),
      ),
      systemUnderTests.create(
        makeFakeTweetThread({ userId: new Id(id2.generatedId) }),
      ),
    ])

    const threads1 = await systemUnderTests.findByUserId(id1.generatedId)
    const threads2 = await systemUnderTests.findByUserId(id2.generatedId)
    expect(threads1.length).toBe(1)
    expect(threads1.map((t) => t.id)).toEqual([t1.generatedId])
    expect(threads2.length).toBe(2)
    expect(threads2.map((t) => t.id).includes(t2.generatedId)).toEqual(true)
    expect(threads2.map((t) => t.id).includes(t3.generatedId)).toEqual(true)
  })
})
