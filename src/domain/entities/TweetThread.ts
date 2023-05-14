import { Id } from './valueObjects/Id'
import { Entity } from './Entity'
import { Optional } from '@/@types/Optional'

type TweetThreadProps = {
  ownerId: Id
  transcript: string
  tweets: string[]
  createdAt: Date
  updatedAt: Date
}

export type TweetThreadCreateProps = Optional<
  TweetThreadProps,
  'createdAt' | 'updatedAt'
>

export class TweetThread extends Entity<TweetThreadProps> {
  get ownerId() {
    return this.props.ownerId
  }

  get transcript() {
    return this.props.transcript
  }

  get tweets() {
    return this.props.tweets
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: TweetThreadCreateProps, id?: Id) {
    const { createdAt, updatedAt } = props
    const now = new Date()
    return new TweetThread(
      {
        ...props,
        createdAt: createdAt ?? now,
        updatedAt: updatedAt ?? now,
      },
      id,
    )
  }
}
