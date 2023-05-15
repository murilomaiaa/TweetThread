import 'express-async-errors'

import cors from 'cors'
import express, { Express } from 'express'
import helmet from 'helmet'
import { contentType } from './middlewares/contentType'
import { errorHandler } from './middlewares/errorHandler'
import { makeAuthController } from './factories/controllers/makeAuthController'
import { AuthController } from '@/presentation/controllers/AuthController'
import { makeTweetThreadController } from './factories/controllers/makeTweetThreadController'
import { TweetThreadController } from '@/presentation/controllers/TweetThreadController'
import { EnsureAuthenticatedMiddleware } from '@/presentation/middleware/EnsureAuthenticatedMiddleware'
import { makeEnsureAuthenticatedMiddleware } from './factories/middlewares/makeEnsureAuthenticatedMiddleware'

export class Server {
  public readonly app: Express

  constructor() {
    this.app = express()
    this.setupMiddlewares()
    this.setupRoutes()
    this.app.use(errorHandler)
  }

  private setupMiddlewares() {
    this.app.use(helmet())
    this.app.use(contentType)
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(
      express.urlencoded({
        extended: true,
      }),
    )
  }

  private setupRoutes() {
    const ensureAuthenticatedMiddleware: EnsureAuthenticatedMiddleware =
      makeEnsureAuthenticatedMiddleware()

    const authController: AuthController = makeAuthController()
    this.app.post('/auth/signup', authController.signUp.bind(authController))
    this.app.post('/auth/login', authController.login.bind(authController))

    this.app.use(
      '/tweet-threads',
      ensureAuthenticatedMiddleware.handle.bind(ensureAuthenticatedMiddleware),
    )
    const tweetThreadController: TweetThreadController =
      makeTweetThreadController()
    this.app.post(
      '/tweet-threads',
      tweetThreadController.signUp.bind(tweetThreadController),
    )
  }

  async start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  }
}
