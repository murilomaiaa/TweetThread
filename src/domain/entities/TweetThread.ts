import { Id } from './valueObjects/Id'
import { Entity } from './Entity'
import { Optional } from '@/@types/Optional'

type TweetThreadsProps = {
  ownerId: Id
  transcript: string
  tweets: string[]
  createdAt: Date
  updatedAt: Date
}

type CreateTweetThreadsProps = Optional<
  TweetThreadsProps,
  'createdAt' | 'updatedAt'
>

export class TweetThread extends Entity<TweetThreadsProps> {
  static create(props: CreateTweetThreadsProps, id?: Id) {
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
