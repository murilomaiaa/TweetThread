import { Id } from './valueObjects/Id'
import { Entity } from './Entity'

export type UserProps = {
  email: string
  password: string
}

export class User extends Entity<UserProps> {
  static create(props: UserProps, id?: Id) {
    return new User(props, id)
  }
}
