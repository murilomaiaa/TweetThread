import { ApplicationError } from './ApplicationError'

export class EmailAlreadyInUseError extends ApplicationError {
  constructor() {
    super('Email already in use')
  }
}
