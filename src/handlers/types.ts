import { addCommentSchema, addPostSchema, deleteCommentSchema, fileUploadSchema } from '../validation/validation-schemas'
import z from 'zod'

export type AddCommentCommandPayload = z.infer<typeof addCommentSchema>
export type AddPostCommandPayload = z.infer<typeof addPostSchema>
export type DeletePostCommandPayload = z.infer<typeof deleteCommentSchema>
export type FileUploadCommandPayload = z.infer<typeof fileUploadSchema>
