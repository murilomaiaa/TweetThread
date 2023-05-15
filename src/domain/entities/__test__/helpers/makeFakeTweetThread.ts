import { TweetThread, TweetThreadCreateProps } from '../../TweetThread'
import { Id } from '../../valueObjects/Id'

export function makeFakeTweetThread(
  props: Partial<TweetThreadCreateProps> = {},
  id?: Id,
) {
  return TweetThread.create(
    {
      userId: new Id(Date.now().toString()),
      tweets: 'A list of tweets'.split(' '),
      transcript: 'A random transcript',
      ...props,
    },
    id,
  )
}
