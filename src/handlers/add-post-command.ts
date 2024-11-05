import { COMMAND_ADD_POST } from '@/commands/types'
import mediator from '@/mediator/mediator'
import { handleError } from '@/utils/handle-error'
import { handleResponse } from '@/utils/handle-response'
import { addPostSchema } from '@/validation/validation-schemas'
import { Request, Response } from 'express'

export const addPostCommandHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = addPostSchema.parse(req.body)

    await mediator.sendCommand({ type: COMMAND_ADD_POST, payload })
    handleResponse(res, 200, { message: 'Resource is being created' })
  } catch (error) {
    handleError(res, error)
  }
}
