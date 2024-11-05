import { Command, CommandHandler, commandHandlers, Query, QueryHandler, queryHandlers } from './types'

const registerCommand = <T extends Command>(commandType: string, handler: CommandHandler<T>): void => {
  commandHandlers[commandType] = handler
}

const registerQuery = <T extends Query, TResult>(queryType: string, handler: QueryHandler<T, TResult>): void => {
  queryHandlers[queryType] = handler
}

const sendCommand = async <T extends Command>(command: T): Promise<void> => {
  const handler = commandHandlers[command.type]
  if (handler === null || handler === undefined) throw new Error(`No handler registered for command: ${command.type}`)
  await handler(command)
}

const sendQuery = async <T extends Query, TResult>(query: T): Promise<TResult> => {
  const handler = queryHandlers[query.type]
  if (handler === null || handler === undefined) throw new Error(`No handler registered for query: ${query.type}`)
  return await handler(query)
}

export default {
  registerCommand,
  registerQuery,
  sendCommand,
  sendQuery
}
