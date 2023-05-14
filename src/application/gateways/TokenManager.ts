import { Id } from '@/domain/entities/valueObjects/Id'

export type Payload = {
  id: Id
}

export interface TokenManager {
  sign(info: Payload, expiresIn?: string): Promise<string>
  verify(token: string): Promise<Payload>
}
