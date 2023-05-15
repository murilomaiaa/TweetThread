import { Id } from './valueObjects/Id'
import { Entity } from './Entity'
import { Email } from './valueObjects/Email'
import { Password } from './valueObjects/Password'

export type UserProps = {
  email: Email
  password: Password
}

export type UserCreateProps = {
  email: string
  password: string
}

export class User extends Entity<UserProps> {
  get email() {
    return this.props.email.value
  }

  get password() {
    return this.props.password.toString()
  }

  set password(password: string) {
    this.props.password = new Password(password)
  }

  static create(props: UserCreateProps, id?: Id) {
    return new User(
      {
        email: new Email(props.email),
        password: new Password(props.password),
      },
      id,
    )
  }
}
