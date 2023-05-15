import { ApplicationError } from '@/application/errors/ApplicationError'
import { DomainError } from '@/domain/entities/errors/DomainError'
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export const errorHandler = (
  error: Error,
  _: Request,
  response: Response,
  __: NextFunction,
) => {
  if (error instanceof ApplicationError || error instanceof DomainError) {
    return response.status(400).json({
      status: 'error',
      message: error.message,
    })
  }

  if (error instanceof ZodError) {
    const formatted = error.format()
    const { _errors, ...rest } = formatted
    const firstError = Object.entries(rest)[0]
    const field = firstError[0]
    const message = (firstError[1] as any)._errors[0]

    return response.status(400).json({
      status: 'error',
      message: `${field}: ${message}`,
    })
  }

  console.log(error)
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
}
