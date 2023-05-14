import { Payload, TokenManager } from '@/application/gateways/TokenManager'
import { sign, verify } from 'jsonwebtoken'

export class JwtTokenManager implements TokenManager {
  private readonly secret: string

  constructor(secret: string) {
    this.secret = secret
  }

  async sign(info: Payload, expires?: string): Promise<string> {
    if (expires) {
      return sign(info, this.secret, { expiresIn: expires })
    }
    return sign(info, this.secret, { expiresIn: '1d' })
  }

  async verify(token: string): Promise<Payload> {
    return verify(token, this.secret) as Payload
  }
}
