import { EnsureAuthenticated } from '@/application/useCases/EnsureAuthenticated'
import { Request, Response, NextFunction } from 'express'

export class EnsureAuthenticatedMiddleware {
  constructor(private readonly ensureAuthenticated: EnsureAuthenticated) {}

  async handle(request: Request, response: Response, next: NextFunction) {
    const result = await this.ensureAuthenticated.handle({
      authToken: request.headers.authorization,
    })

    if (!result.isAuthenticated) {
      return response.status(401).json({
        message: 'Invalid token',
      })
    }

    request.userId = result.id

    return next()
  }
}
