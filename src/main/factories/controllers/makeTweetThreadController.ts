import { UserRepositorySingleton } from '../repositories/UserRepositorySingleton'
import { TweetThreadController } from '@/presentation/controllers/TweetThreadController'
import { CreateTweetThread } from '@/application/useCases/CreateTweetThread'
import { TweetThreadRepositorySingleton } from '../repositories/TweetThreadRepositorySingleton'
import { TweetThreadGeneratorSingleton } from '../gateways/TweetThreadGeneratorSingleton'

export const makeTweetThreadController = () => {
  const userRepository = UserRepositorySingleton.getInstance()
  const tweetThreadRepository = TweetThreadRepositorySingleton.getInstance()

  const threadGenerator = TweetThreadGeneratorSingleton.getInstance()

  const signUp = new CreateTweetThread(
    userRepository,
    threadGenerator,
    tweetThreadRepository,
  )

  return new TweetThreadController(signUp)
}
