import { Id } from './valueObjects/Id'
import { Entity } from './Entity'
import { Email } from './valueObjects/Email'
import { Password } from './valueObjects/Password'

export type UserProps = {
  email: Email
  password: Password
  savedTweetThreadsIds: string[]
}

export type UserCreateProps = {
  email: string
  password: string
  savedTweetThreadsIds?: string[]
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

  get savedTweetThreadsIds() {
    return this.props.savedTweetThreadsIds
  }

  static create(props: UserCreateProps, id?: Id) {
    return new User(
      {
        email: new Email(props.email),
        password: new Password(props.password),
        savedTweetThreadsIds: props.savedTweetThreadsIds ?? [],
      },
      id,
    )
  }
}
