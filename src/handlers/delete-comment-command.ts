import { Request, Response } from 'express'
import { deleteCommentSchema } from '../validation/validation-schemas'
import { handleError } from '../utils/handle-error'
import { COMMAND_DELETE_COMMENT } from '../commands/types'
import { handleResponse } from '../utils/handle-response'
import mediator from '../mediator/mediator'

export const deleteCommentCommandHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = deleteCommentSchema.parse({
      ...req.body, // only this case to get creator id, normally it should've been extracted from authorization token
      ...req.params
    })

    await mediator.sendCommand({ type: COMMAND_DELETE_COMMENT, payload })
    handleResponse(res, 200, { message: 'Resource is being deleted' })
  } catch (error) {
    handleError(res, error)
  }
}
