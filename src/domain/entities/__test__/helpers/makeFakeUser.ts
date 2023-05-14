import { User, UserCreateProps } from '../../User'
import { Id } from '../../valueObjects/Id'

export function makeFakeUser(props: Partial<UserCreateProps> = {}, id?: Id) {
  return User.create(
    {
      email: 'valid@mail.com',
      password: 'validPassword',
      ...props,
    },
    id,
  )
}
