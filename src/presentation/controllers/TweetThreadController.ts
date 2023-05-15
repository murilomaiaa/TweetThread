import { CreateTweetThread } from '@/application/useCases/CreateTweetThread'
import { GetAllUserTweetThreads } from '@/application/useCases/GetAllUserTweetThreads'
import { Request, Response } from 'express'
import { z } from 'zod'

export class TweetThreadController {
  constructor(
    private readonly createTweetThread: CreateTweetThread,
    private readonly getAllUserTweetThreads: GetAllUserTweetThreads,
  ) {}

  public async create(request: Request, response: Response) {
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

  public async findByOwnerId(request: Request, response: Response) {
    const { threads } = await this.getAllUserTweetThreads.handle({
      // @ts-ignore
      userId: request.userId,
    })

    return response.json({
      threads: threads.map((t) => ({
        id: t.id,
        transcript: t.transcript,
        tweets: t.tweets,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
    })
  }
}
