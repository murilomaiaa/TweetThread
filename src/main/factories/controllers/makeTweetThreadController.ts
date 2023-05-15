import { UserRepositorySingleton } from '../repositories/UserRepositorySingleton'
import { TweetThreadController } from '@/presentation/controllers/TweetThreadController'
import { CreateTweetThread } from '@/application/useCases/CreateTweetThread'
import { TweetThreadRepositorySingleton } from '../repositories/TweetThreadRepositorySingleton'
import { TweetThreadGeneratorSingleton } from '../gateways/TweetThreadGeneratorSingleton'
import { GetAllUserTweetThreads } from '@/application/useCases/GetAllUserTweetThreads'

export const makeTweetThreadController = () => {
  const userRepository = UserRepositorySingleton.getInstance()
  const tweetThreadRepository = TweetThreadRepositorySingleton.getInstance()

  const threadGenerator = TweetThreadGeneratorSingleton.getInstance()

  const createTweetThread = new CreateTweetThread(
    userRepository,
    threadGenerator,
    tweetThreadRepository,
  )

  const getAllUserTweetThreads = new GetAllUserTweetThreads(
    tweetThreadRepository,
  )

  return new TweetThreadController(createTweetThread, getAllUserTweetThreads)
}
