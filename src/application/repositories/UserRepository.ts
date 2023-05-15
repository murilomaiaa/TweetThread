import { User } from '@/domain/entities/User'
import { CreateEntityOutput } from './types/CreateEntityOutput'

export interface UserRepository {
  findById(id: string): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>
  create(user: User): Promise<CreateEntityOutput>
}
