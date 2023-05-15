import { SignUp } from '@/application/useCases/SignUp'
import { Request, Response } from 'express'
import { z } from 'zod'

export class AuthController {
  constructor(private readonly signUpUseCase: SignUp) {}

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
}
