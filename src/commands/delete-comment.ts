import mongoose from 'mongoose'
import { ServiceException } from '../exceptions/service-exception'
import { DeletePostCommandPayload } from '../handlers/types'
import { Command } from '../mediator/types'
import { Post } from '../models/post'
import { EVENT_DELETE_COMMENT, MessagePayload } from './types'
import producer from '../producer/producer'
import { Comment } from '@/models/comment'

export const deleteCommentCommand = async (params: Command<DeletePostCommandPayload>): Promise<void> => {
  if (params.payload === null || params.payload === undefined) {
    throw new ServiceException('DeleteCommentCommand: payload can\'t be empty')
  }

  if (process.env.COMMENT_EVENT_TOPIC === null || process.env.COMMENT_EVENT_TOPIC === undefined) {
    throw new ServiceException('Comment event topic must be defined in .env')
  }

  const promises = [
    Post.findById(mongoose.Types.ObjectId.createFromHexString(params.payload?.postId)),
    Comment.findById(mongoose.Types.ObjectId.createFromHexString(params.payload?.commentId))
  ]

  const [post, comment] = await Promise.all(promises);
  if (post === null || post === undefined) {
    throw new ServiceException(`Post with id: ${params.payload?.postId} is not in our system`, 403)
  }

  if (comment === null || post === undefined) {
    throw new ServiceException(`Comment with id: ${params.payload?.commentId} is not in our system`, 403)
  }

  if (comment.creator.toString() !== params.payload.creator) {
    throw new ServiceException(`Creator only can delete own comment`, 403)  
  }

  const topic = process.env.COMMENT_EVENT_TOPIC
  const messagePayload: MessagePayload = {
    event: EVENT_DELETE_COMMENT,
    data: params.payload
  }

  await producer.produceMessage(messagePayload, topic)
  console.log(`Message produced to topic: ${topic}, with data: ${JSON.stringify(messagePayload)}`)
}
