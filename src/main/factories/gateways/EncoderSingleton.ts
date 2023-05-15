import { Encoder } from '@/application/gateways/Encoder'
import { BcryptEncoder } from '@/infra/gateways/BcryptEncoder'

export class EncoderSingleton {
  private static instance: Encoder

  private constructor() {}

  public static getInstance(): Encoder {
    if (!EncoderSingleton.instance) {
      EncoderSingleton.instance = new BcryptEncoder(10)
    }
    return EncoderSingleton.instance
  }
}
