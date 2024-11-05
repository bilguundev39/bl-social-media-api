import { COMMAND_ADD_COMMENT } from '@/commands/types'
import mediator from '@/mediator/mediator'
import { handleError } from '@/utils/handle-error'
import { handleResponse } from '@/utils/handle-response'
import { addCommentSchema } from '@/validation/validation-schemas'
import { Request, Response } from 'express'

export const addCommentCommandHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = addCommentSchema.parse({
      ...req.body,
      ...req.params
    })

    await mediator.sendCommand({ type: COMMAND_ADD_COMMENT, payload })
    handleResponse(res, 200, { message: 'Resource is being created' })
  } catch (error) {
    handleError(res, error)
  }
}
