import { SignUp } from '@/application/useCases/SignUp'
import { EncoderSingleton } from '../gateways/EncoderSingleton'
import { TokenManagerSingleton } from '../gateways/TokenManagerSingleton'
import { UserRepositorySingleton } from '../repositories/UserRepositorySingleton'
import { AuthController } from '@/presentation/controllers/AuthController'
import { Login } from '@/application/useCases/Login'

export const makeAuthController = () => {
  const userRepository = UserRepositorySingleton.getInstance()

  const encoder = EncoderSingleton.getInstance()
  const tokenManager = TokenManagerSingleton.getInstance()

  const signUp = new SignUp(userRepository, encoder, tokenManager)
  const login = new Login(userRepository, encoder, tokenManager)

  return new AuthController(signUp, login)
}
