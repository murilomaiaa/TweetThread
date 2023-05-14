import { UserRepository } from '../repositories/UserRepository'
import { Encoder } from '../gateways/Encoder'
import { TokenManager } from '../gateways/TokenManager'
import { InvalidPassword } from '../errors/InvalidPassword'

type LoginProps = {
  email: string
  password: string
}

export class Login {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly encoder: Encoder,
    private readonly tokenManager: TokenManager,
  ) {}

  public async handle({ email, password }: LoginProps) {
    const user = await this.usersRepository.findByEmail(email)

    if (user === undefined) {
      throw new InvalidPassword()
    }

    const passwordMatch = await this.encoder.compare(password, user.password)
    if (!passwordMatch) {
      throw new InvalidPassword()
    }

    const accessToken = await this.tokenManager.sign({ id: user.id })

    return {
      accessToken,
      id: user.id.toString(),
    }
  }
}
