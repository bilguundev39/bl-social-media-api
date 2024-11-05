import { addPostCommand } from '../commands/add-post'
import { queryPaginatedPost } from '../queries/paginated-posts'
import { COMMAND_ADD_COMMENT, COMMAND_ADD_POST, COMMAND_DELETE_COMMENT } from '../commands/types'
import mediator from './mediator'
import { addCommentCommand } from '../commands/add-comment'
import { deleteCommentCommand } from '../commands/delete-comment'
import { QUERY_PRESIGNED_URL, QUERY_PAGINATED_POST } from '../queries/types'
import { queryPresignedUrl } from '../queries/presigned-url'

export const initMediators = (): void => {
  registerQueries()
  registerCommands()
}

const registerQueries = (): void => {
  mediator.registerQuery(QUERY_PAGINATED_POST, queryPaginatedPost)
  mediator.registerQuery(QUERY_PRESIGNED_URL, queryPresignedUrl)
}

const registerCommands = (): void => {
  mediator.registerCommand(COMMAND_ADD_POST, addPostCommand)
  mediator.registerCommand(COMMAND_ADD_COMMENT, addCommentCommand)
  mediator.registerCommand(COMMAND_DELETE_COMMENT, deleteCommentCommand)
}
