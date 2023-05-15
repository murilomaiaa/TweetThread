import 'express-async-errors'

import cors from 'cors'
import express, { Express } from 'express'
import helmet from 'helmet'

import { SignUp } from '@/application/useCases/SignUp'
import { BcryptEncoder } from '@/infra/gateways/BcryptEncoder'
import { JwtTokenManager } from '@/infra/gateways/JwtTokenManager'
import { MongodbUserRepository } from '@/infra/mongodb/repositories/MongodbUserRepository'
import { AuthController } from '@/presentation/controllers/AuthController'
import config from '@/shared/config'
import { contentType } from './middlewares/contentType'
import { errorHandler } from './middlewares/errorHandler'

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
    const userRepository = new MongodbUserRepository()
    const encoder = new BcryptEncoder(10)
    const tokenManager = new JwtTokenManager(config.jwtSecret ?? '')
    const signUp = new SignUp(userRepository, encoder, tokenManager)
    const authController = new AuthController(signUp)
    this.app.post('/auth/signup', authController.signUp.bind(authController))
  }

  async start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  }
}
