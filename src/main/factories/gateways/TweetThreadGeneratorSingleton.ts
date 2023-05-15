import { ThreadGenerator } from '@/application/gateways/ThreadGenerator'
import { OpenAIThreadGenerator } from '@/infra/gateways/OpenAIThreadGenerator'

export class TweetThreadGeneratorSingleton {
  private static instance: ThreadGenerator

  private constructor() {}

  public static getInstance(): ThreadGenerator {
    if (!TweetThreadGeneratorSingleton.instance) {
      TweetThreadGeneratorSingleton.instance = new OpenAIThreadGenerator()
    }
    return TweetThreadGeneratorSingleton.instance
  }
}
