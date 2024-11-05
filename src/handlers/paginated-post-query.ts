import { Request, Response } from 'express'
import mediator from '../mediator/mediator'
import { getPaginatedPostsSchema } from '../validation/validation-schemas'
import z from 'zod'
import { handleError } from '../utils/handle-error'
import { handleResponse } from '../utils/handle-response'

export type PaginatedPostQueryPayload = z.infer<typeof getPaginatedPostsSchema>

export const getPaginatedPostQueryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = getPaginatedPostsSchema.parse(req.query)

    const result = await mediator.sendQuery({ type: 'QUERY_PAGINATED_POST', payload })
    handleResponse(res, 200, result)
  } catch (error) {
    handleError(res, error)
  }
}
