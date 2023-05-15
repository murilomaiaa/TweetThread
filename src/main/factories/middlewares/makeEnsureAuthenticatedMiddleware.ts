import { EnsureAuthenticated } from '@/application/useCases/EnsureAuthenticated'
import { EnsureAuthenticatedMiddleware } from '@/presentation/middleware/EnsureAuthenticatedMiddleware'
import { TokenManagerSingleton } from '../gateways/TokenManagerSingleton'

export const makeEnsureAuthenticatedMiddleware = () => {
  const tokenManager = TokenManagerSingleton.getInstance()
  const ensureAuthenticatedUseCase = new EnsureAuthenticated(tokenManager)
  return new EnsureAuthenticatedMiddleware(ensureAuthenticatedUseCase)
}
