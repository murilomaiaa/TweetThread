import { User } from '@/domain/entities/User'
import { MongodbUser } from '../repositories/MongodbUserRepository'

export class UserMapper {
  toEntity(user: MongodbUser): User {
    return User.create(user)
  }
}
