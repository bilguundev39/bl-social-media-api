import { Request, Response } from 'express'
import mediator from '../mediator/mediator'
import { handleError } from '../utils/handle-error'
import { handleResponse } from '../utils/handle-response'
import { QUERY_PRESIGNED_URL } from '../queries/types'

export const presignedUrlCommandHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await mediator.sendQuery({
      type: QUERY_PRESIGNED_URL,
      payload: undefined
    })
    handleResponse(res, 200, result)
  } catch (error) {
    handleError(res, error)
  }
}
