export interface Command<TPayload = any> { type: string, payload?: TPayload }
export interface Query<TPayload = any> { type: string, payload: TPayload }

export type CommandHandler<T extends Command> = (command: T) => Promise<void>
export type QueryHandler<T extends Query, TResult> = (query: T) => Promise<TResult>

export const commandHandlers: Record<string, CommandHandler<any>> = {}
export const queryHandlers: Record<string, QueryHandler<any, any>> = {}
