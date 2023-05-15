import { TokenManager } from '../gateways/TokenManager'

type EnsureAuthenticatedProps = {
  authToken?: string
}

type EnsureAuthenticatedResult =
  | { isAuthenticated: false }
  | { isAuthenticated: true; id: string }

export class EnsureAuthenticated {
  constructor(private readonly tokenManager: TokenManager) {}

  public async handle({
    authToken,
  }: EnsureAuthenticatedProps): Promise<EnsureAuthenticatedResult> {
    const [, token] = authToken?.split(' ') ?? ''
    if (!token) {
      return { isAuthenticated: false }
    }

    try {
      const { id } = await this.tokenManager.verify(token)
      return { isAuthenticated: true, id }
    } catch {
      return { isAuthenticated: false }
    }
  }
}
