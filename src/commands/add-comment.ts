import { ServiceException } from '../exceptions/service-exception'
import { AddCommentCommandPayload } from '../handlers/types'
import { Command } from '../mediator/types'
import { Post } from '../models/post'
import producer from '../producer/producer'
import mongoose from 'mongoose'
import { EVENT_ADD_COMMENT, MessagePayload } from './types'

export const addCommentCommand = async (params: Command<AddCommentCommandPayload>): Promise<void> => {
  if (params.payload === null || params.payload === undefined) {
    throw new ServiceException('AddCommentCommand: payload can\'t be empty')
  }

  if (process.env.COMMENT_EVENT_TOPIC === null || process.env.COMMENT_EVENT_TOPIC === undefined) {
    throw new ServiceException('Comment event topic must be defined in .env')
  }

  // simple check for post existence
  const post = Post.findById(mongoose.Types.ObjectId.createFromHexString(params.payload?.postId))
  if (post === null || post === undefined) {
    throw new ServiceException(`Post with id: ${params.payload?.postId} is not in our system`, 403)
  }

  const topic = process.env.COMMENT_EVENT_TOPIC

  const messagePayload: MessagePayload = {
    event: EVENT_ADD_COMMENT,
    data: params.payload
  }

  await producer.produceMessage(messagePayload, process.env.COMMENT_EVENT_TOPIC)
  console.log(`Message produced to topic: ${topic}, with data: ${JSON.stringify(messagePayload)}`)
}
