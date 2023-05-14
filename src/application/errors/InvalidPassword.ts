export class InvalidPassword extends Error {
  constructor() {
    super('Invalid email/password')
  }
}
