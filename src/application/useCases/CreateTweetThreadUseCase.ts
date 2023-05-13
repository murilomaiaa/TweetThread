import { Id } from '@/domain/entities/valueObjects/Id'
import { UserRepository } from '../repositories/UserRepository'
import { UserNotFoundError } from '../errors/UserNotFoundError'

type CreateTweetThreadProps = {
  userId: string
  transcript: string
}

export class CreateTweetThreadUseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  async handle({ transcript, userId }: CreateTweetThreadProps) {
    const user = await this.usersRepository.findById(new Id(userId))

    if (user === undefined) {
      throw new UserNotFoundError()
    }
  }
}
