import { UserRepository } from '@/application/repositories/UserRepository'
import { User } from '@/domain/entities/User'
import { Id } from '@/domain/entities/valueObjects/Id'
import { MongoHelper } from '../MongoHelper'
import { Collection, ObjectId } from 'mongodb'
import { UserMapper } from '../Mappers/UserMapper'
import { CreateEntityOutput } from '@/application/repositories/types/CreateEntityOutput'

export type MongodbUser = {
  email: string
  password: string
  _id: ObjectId
}

export class MongodbUserRepository implements UserRepository {
  private mapper: UserMapper
  private collection: Collection<MongodbUser>

  constructor() {
    this.mapper = new UserMapper()
    this.collection = MongoHelper.getCollection<MongodbUser>('users')
  }

  async findById(id: Id): Promise<User | undefined> {
    const objectId = new ObjectId(id.toString())
    const user = await this.collection.findOne<MongodbUser>({ _id: objectId })
    if (user) {
      return this.mapper.toEntity(user)
    }
    return undefined
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.collection.findOne({ email })
    if (user) {
      return this.mapper.toEntity(user)
    }
    return undefined
  }

  async create(user: User): Promise<CreateEntityOutput> {
    const { email, password } = user
    const _id = new ObjectId()
    const mongodbUser: MongodbUser = {
      email,
      password,
      _id,
    }
    await this.collection.insertOne(mongodbUser)
    return {
      generatedId: new Id(_id.toString()),
    }
  }
}
