import z from 'zod'
import { ObjectId } from 'mongodb'

const validImageExtensions = ['jpg', 'png', 'bmp']

const objectIdSchema = z.string().refine((val) => {
  return ObjectId.isValid(val)
}, {
  message: 'Invalid Id format'
})

export const getPaginatedPostsSchema = z.object({
  limit: z.preprocess((val) => {
    if (typeof val === 'string' && !isNaN(Number(val))) {
      return parseInt(val, 10)
    }
    return val
  }, z.number().min(1).max(50).default(10)), // limits 50 post in 1 page
  cursor: objectIdSchema.optional(),
  direction: z.enum(['next', 'prev']).default('next')
})

export const addPostSchema = z.object({
  caption: z.string().min(1).max(50), // caption 0-50 length of string is accepted
  body: z.string().url({ message: 'Must be valid image url' }).refine(value => {
    const loweredUrl = value.toLowerCase()
    return validImageExtensions.some((ext) => loweredUrl.endsWith(ext))
  }, { message: 'Must be valid image url' }),
  creator: objectIdSchema
})

export const addCommentSchema = z.object({
  content: z.string().min(1).max(3000), // can someone add really long comment
  creator: objectIdSchema,
  postId: objectIdSchema
})

export const deleteCommentSchema = z.object({
  creator: objectIdSchema,
  postId: objectIdSchema,
  commentId: objectIdSchema
})

export const fileUploadSchema = z.object({
  fileId: objectIdSchema
})
