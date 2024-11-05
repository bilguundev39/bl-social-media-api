import { ServiceException } from '../exceptions/service-exception'
import { Response } from 'express'
import { ZodError } from 'zod'

export const handleError = (res: Response, error: unknown): void => {
  if (error instanceof ServiceException) {
    res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode
    })
  } else if (error instanceof ZodError) {
    res.status(403).json({ message: JSON.parse(error.message) })
  } else {
    console.log('unknown exception ---------->')
    console.log(error)
    res.status(500).json({ message: 'unknown exception' })
  }
}
