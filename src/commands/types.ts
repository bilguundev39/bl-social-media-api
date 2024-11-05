// this is used for mediator as key to invoke method
export const COMMAND_ADD_POST = 'COMMAND_ADD_POST'
export const COMMAND_ADD_COMMENT = 'COMMAND_ADD_COMMENT'
export const COMMAND_DELETE_COMMENT = 'COMMAND_DELETE_COMMENT'

export const EVENT_ADD_COMMENT = 'EVENT_ADD_COMMENT'
export const EVENT_ADD_POST = 'EVENT_ADD_POST'
export const EVENT_DELETE_COMMENT = 'EVENT_DELETE_COMMENT'

export interface MessagePayload {
  event: string
  data: Record<string, any>
}
