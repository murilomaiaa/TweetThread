import { DomainError } from '../errors/DomainError'
import { Password } from './Password'

describe('Password', () => {
  it('should create a valid password object', () => {
    const password = new Password('123456')

    expect(password.value).toEqual('123456')
  })

  it('should throw an error for an invalid password address', () => {
    const systemUnderTests = () => new Password('short')

    expect(systemUnderTests).toThrow(new DomainError('Invalid password'))
  })

  it('should return the password address as a string', () => {
    const password = new Password('test@example.com')

    expect(String(password)).toEqual('test@example.com')
  })
})
