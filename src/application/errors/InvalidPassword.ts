import { ApplicationError } from './ApplicationError'

export class InvalidPassword extends ApplicationError {
  constructor() {
    super('Invalid email/password')
  }
}
