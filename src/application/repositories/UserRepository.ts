import { User } from '@/domain/entities/User'
import { Id } from '@/domain/entities/valueObjects/Id'

export interface UserRepository {
  findById(id: Id): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>
  create(user: User): Promise<void>
}
