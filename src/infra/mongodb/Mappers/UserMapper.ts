import { User } from '@/domain/entities/User'
import { MongodbUser } from '../repositories/MongodbUserRepository'
import { Id } from '@/domain/entities/valueObjects/Id'

export class UserMapper {
  toEntity(user: MongodbUser): User {
    return User.create(user, new Id(user._id.toHexString()))
  }
}
