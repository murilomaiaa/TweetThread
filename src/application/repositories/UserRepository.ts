import { User } from '@/domain/entities/User'
import { Id } from '@/domain/entities/valueObjects/Id'

export interface UserRepository {
  findById(email: Id): Promise<User | undefined>
}
