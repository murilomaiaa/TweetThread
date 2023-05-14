import { UserRepository } from '../repositories/UserRepository'
import { EmailAlreadyInUseError } from '../errors/EmailAlreadyInUseError'
import { Encoder } from '../gateways/Encoder'
import { User } from '@/domain/entities/User'

type SignUpProps = {
  email: string
  password: string
}

export class SignUp {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly encoder: Encoder,
  ) {}

  public async handle({ email, password }: SignUpProps) {
    const user = User.create({ email, password })
    const userWithSameEmail = await this.usersRepository.findByEmail(user.email)

    if (userWithSameEmail !== undefined) {
      throw new EmailAlreadyInUseError()
    }

    const hashPassword = await this.encoder.encode(user.password)
    user.password = hashPassword

    await this.usersRepository.create(user)
  }
}
