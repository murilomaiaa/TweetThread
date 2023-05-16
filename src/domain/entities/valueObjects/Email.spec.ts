import { DomainError } from '../errors/DomainError'
import { Email } from './Email'

describe('Email', () => {
  it('should create a valid email object', () => {
    const email = new Email('valid@mail.com')

    expect(email.value).toEqual('valid@mail.com')
  })

  it('should throw an error for an invalid email address', () => {
    const systemUnderTests = () => new Email('invalid-email')

    expect(systemUnderTests).toThrow(new DomainError('Invalid email address'))
  })

  it('should return the email address as a string', () => {
    const email = new Email('test@example.com')

    expect(String(email)).toEqual('test@example.com')
  })
})
