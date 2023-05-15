import { User } from '@/domain/entities/User'
import { MongodbUser } from '../repositories/MongodbUserRepository'
import { Id } from '@/domain/entities/valueObjects/Id'

export class UserMapper {
  toEntity(user: MongodbUser): User {
    return User.create(
      {
        ...user,
        savedTweetThreadsIds: user.savedTweetThreads.map((t) =>
          t.toHexString(),
        ),
      },
      new Id(user._id.toHexString()),
    )
  }
}
