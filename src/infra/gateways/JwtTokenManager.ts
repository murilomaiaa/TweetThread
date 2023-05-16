import { Payload, TokenManager } from '@/application/gateways/TokenManager'
import { sign, verify } from 'jsonwebtoken'

export class JwtTokenManager implements TokenManager {
  private readonly secret: string

  constructor(secret: string) {
    this.secret = secret
  }

  async sign(info: Payload, expires = '1d'): Promise<string> {
    return sign(info, this.secret, { expiresIn: expires })
  }

  async verify(token: string): Promise<Payload> {
    return verify(token, this.secret) as Payload
  }
}
