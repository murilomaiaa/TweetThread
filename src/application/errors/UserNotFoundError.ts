import { ApplicationError } from './ApplicationError'

export class UserNotFoundError extends ApplicationError {
  constructor() {
    super('User not found')
  }
}
