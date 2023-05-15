import { TokenManager } from '../gateways/TokenManager'
import { EnsureAuthenticated } from './EnsureAuthenticated'

describe('EnsureAuthenticated', async () => {
  let systemUnderTests: EnsureAuthenticated
  const tokenManager = {
    async verify(token) {
      return {
        id: 'user-id',
      }
    },
  } as TokenManager

  beforeEach(() => {
    systemUnderTests = new EnsureAuthenticated(tokenManager)
  })

  it('should return false when token is falsy', async () => {
    const { isAuthenticated } = await systemUnderTests.handle({
      authToken: 'Bearer ',
    })

    expect(isAuthenticated).toBe(false)
  })

  it('should call verify with correct args', async () => {
    const verifySpy = vi.spyOn(tokenManager, 'verify')

    await systemUnderTests.handle({ authToken: 'Bearer any-token' })

    expect(verifySpy).toHaveBeenCalledOnce()
    expect(verifySpy).toHaveBeenCalledWith('any-token')
  })

  it('should return false when tokenManage throws', async () => {
    vi.spyOn(tokenManager, 'verify').mockRejectedValueOnce(new Error('error'))

    const { isAuthenticated } = await systemUnderTests.handle({
      authToken: 'Bearer any-token',
    })

    expect(isAuthenticated).toBe(false)
  })

  it('should return true and id when token is valid', async () => {
    const result = await systemUnderTests.handle({ authToken: 'Bearer token' })

    expect(result).toEqual({ isAuthenticated: true, id: 'user-id' })
  })
})
