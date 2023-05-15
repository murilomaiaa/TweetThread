import { TokenManager } from '@/application/gateways/TokenManager'
import { JwtTokenManager } from '@/infra/gateways/JwtTokenManager'
import config from '@/main/config'

export class TokenManagerSingleton {
  private static instance: TokenManager

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManagerSingleton.instance) {
      const jwtSecret = config.jwtSecret ?? ''
      TokenManagerSingleton.instance = new JwtTokenManager(jwtSecret)
    }
    return TokenManagerSingleton.instance
  }
}
