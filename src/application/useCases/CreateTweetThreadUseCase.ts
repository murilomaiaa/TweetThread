import { Id } from '@/domain/entities/valueObjects/Id'
import { UserRepository } from '../repositories/UserRepository'
import { UserNotFoundError } from '../errors/UserNotFoundError'
import { ThreadGenerator } from '../geteways/ThreadGenerator'

type CreateTweetThreadProps = {
  userId: string
  transcript: string
}

export class CreateTweetThreadUseCase {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly threadGenerator: ThreadGenerator,
  ) {}

  async handle({ transcript, userId }: CreateTweetThreadProps) {
    const user = await this.usersRepository.findById(new Id(userId))

    if (user === undefined) {
      throw new UserNotFoundError()
    }

    await this.threadGenerator.generate(transcript)
  }
}
