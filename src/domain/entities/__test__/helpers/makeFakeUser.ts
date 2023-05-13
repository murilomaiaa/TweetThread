import { User, UserProps } from '../../User'
import { Id } from '../../valueObjects/Id'

export function makeFakeUser(props: Partial<UserProps> = {}, id?: Id) {
  return User.create(
    {
      email: 'valid@mail.com',
      password: 'validPassword',
      ...props,
    },
    id,
  )
}
