import { Encoder } from '@/application/gateways/Encoder'
import { hash, compare } from 'bcrypt'

export class BcryptEncoder implements Encoder {
  private readonly rounds: number = 10

  constructor(rounds: number) {
    this.rounds = rounds
  }

  async encode(plain: string): Promise<string> {
    return hash(plain, this.rounds)
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed)
  }
}
