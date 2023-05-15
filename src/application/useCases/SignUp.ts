import { UserRepository } from '../repositories/UserRepository'
import { EmailAlreadyInUseError } from '../errors/EmailAlreadyInUseError'
import { Encoder } from '../gateways/Encoder'
import { User } from '@/domain/entities/User'
import { TokenManager } from '../gateways/TokenManager'

type SignUpProps = {
  email: string
  password: string
}

type SignUpResult = {
  accessToken: string
  generatedId: string
}

export class SignUp {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly encoder: Encoder,
    private readonly tokenManager: TokenManager,
  ) {}

  public async handle({ email, password }: SignUpProps): Promise<SignUpResult> {
    const user = User.create({ email, password })
    const userWithSameEmail = await this.usersRepository.findByEmail(user.email)

    if (userWithSameEmail !== undefined) {
      throw new EmailAlreadyInUseError()
    }

    const hashPassword = await this.encoder.encode(user.password)
    user.password = hashPassword

    const { generatedId } = await this.usersRepository.create(user)

    const accessToken = await this.tokenManager.sign({ id: generatedId })

    return {
      accessToken,
      generatedId,
    }
  }
}
