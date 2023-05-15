import { UserRepository } from '@/application/repositories/UserRepository'
import { MongodbUserRepository } from '@/infra/mongodb/repositories/MongodbUserRepository'

export class UserRepositorySingleton {
  private static instance: UserRepository

  private constructor() {}

  public static getInstance(): UserRepository {
    if (!UserRepositorySingleton.instance) {
      UserRepositorySingleton.instance = new MongodbUserRepository()
    }
    return UserRepositorySingleton.instance
  }
}
