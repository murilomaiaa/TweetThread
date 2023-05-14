import { User, UserCreateProps } from '../../User'
import { Id } from '../../valueObjects/Id'

export function makeFakeUser(props: Partial<UserCreateProps> = {}, id?: Id) {
  return User.create(
    {
      email: `${Date.now()}@mail.com`,
      password: 'validPassword',
      ...props,
    },
    id,
  )
}
