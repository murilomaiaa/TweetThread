import { Id } from './valueObjects/Id'
import { Entity } from './Entity'
import { Email } from './valueObjects/Email'

export type UserProps = {
  email: Email
  password: string
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
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  static create(props: UserCreateProps, id?: Id) {
    return new User(
      {
        email: new Email(props.email),
        password: props.password,
      },
      id,
    )
  }
}
