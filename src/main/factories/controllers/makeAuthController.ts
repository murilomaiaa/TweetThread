import { SignUp } from '@/application/useCases/SignUp'
import { EncoderSingleton } from '../gateways/EncoderSingleton'
import { TokenManagerSingleton } from '../gateways/TokenManagerSingleton'
import { UserRepositorySingleton } from '../repositories/UserRepositorySingleton'
import { AuthController } from '@/presentation/controllers/AuthController'

export const makeAuthController = () => {
  const userRepository = UserRepositorySingleton.getInstance()
  const encoder = EncoderSingleton.getInstance()
  const tokenManager = TokenManagerSingleton.getInstance()
  const signUp = new SignUp(userRepository, encoder, tokenManager)
  return new AuthController(signUp)
}
