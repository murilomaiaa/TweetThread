import { DomainError } from '../errors/DomainError'

export class Email {
  private readonly _value: string

  constructor(value: string) {
    if (!this.validate(value)) {
      throw new DomainError('Invalid email address')
    }
    this._value = value
  }

  get value(): string {
    return this._value
  }

  private validate(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  public toString(): string {
    return this._value
  }
}
