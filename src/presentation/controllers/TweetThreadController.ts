import { CreateTweetThread } from '@/application/useCases/CreateTweetThread'
import { Request, Response } from 'express'
import { z } from 'zod'

export class TweetThreadController {
  constructor(private readonly createTweetThread: CreateTweetThread) {}

  public async signUp(request: Request, response: Response) {
    const signUpSchema = z.object({
      transcript: z.string(),
    })

    const { transcript } = signUpSchema.parse(request.body)

    const { tweets } = await this.createTweetThread.handle({
      transcript,
      userId: (request as any).userId,
    })

    return response.status(201).json({
      tweets,
    })
  }
}
