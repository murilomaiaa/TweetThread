import { makeFakeUser } from '@/domain/entities/__test__/helpers/makeFakeUser'
import { MongodbUserRepository } from './MongodbUserRepository'
import { User } from '@/domain/entities/User'
import { MongoHelper } from '../MongoHelper'
import config from '@/main/config'
import { Id } from '@/domain/entities/valueObjects/Id'
import { ObjectId } from 'mongodb'

describe('MongodbUserRepository', () => {
  let systemUnderTests: MongodbUserRepository

  beforeAll(async () => {
    await MongoHelper.connect(config.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(() => {
    systemUnderTests = new MongodbUserRepository()
  })

  it('should create a valid user', async () => {
    const user = makeFakeUser()
    const { generatedId } = await systemUnderTests.create(user)

    const insertedUser = (await systemUnderTests.findById(generatedId)) as User
    expect(insertedUser.id).toEqual(generatedId)
    expect(insertedUser.email).toEqual(user.email)
    expect(insertedUser.password).toEqual(user.password)
  })

  it('should return undefined when user is not found', async () => {
    const user = makeFakeUser({}, new Id(new ObjectId().toHexString()))

    const findUser = await systemUnderTests.findById(user.id)

    expect(findUser).toBeUndefined()
  })

  it('should find a user by email', async () => {
    const randomMail = Date.now().toString() + '@mail.com'
    const user = makeFakeUser({ email: randomMail })
    await systemUnderTests.create(user)

    const findUser = (await systemUnderTests.findByEmail(randomMail)) as User

    expect(findUser).toBeDefined()
    expect(findUser.email).toEqual(user.email)
    expect(findUser.password).toEqual(user.password)
    expect(findUser.id).toBeDefined()
  })
})
