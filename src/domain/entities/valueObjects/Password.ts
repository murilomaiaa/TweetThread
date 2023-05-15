import { DomainError } from '../errors/DomainError'

export class Password {
  private readonly _value: string

  constructor(value: string) {
    if (!this.validate(value)) {
      throw new DomainError('Invalid password')
    }
    this._value = value
  }

  get value(): string {
    return this._value
  }

  private validate(password: string): boolean {
    return password.length > 6
  }

  public toString(): string {
    return this._value
  }
}
