import { Login } from '@/application/useCases/Login'
import { SignUp } from '@/application/useCases/SignUp'
import { Request, Response } from 'express'
import { z } from 'zod'

export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUp,
    private readonly loginUseCase: Login,
  ) {}

  public async signUp(request: Request, response: Response) {
    const signUpSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = signUpSchema.parse(request.body)

    const { accessToken, generatedId } = await this.signUpUseCase.handle({
      email,
      password,
    })

    return response.status(201).json({
      accessToken,
      generatedId,
      message: 'Signup successful',
    })
  }

  public async login(request: Request, response: Response) {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = loginSchema.parse(request.body)

    const { accessToken } = await this.loginUseCase.handle({
      email,
      password,
    })

    return response.status(200).json({
      accessToken,
      message: 'Login successful',
    })
  }
}
