import { ServiceException } from '../exceptions/service-exception'
import { AddPostCommandPayload } from '../handlers/types'
import { Command } from '../mediator/types'
import producer from '../producer/producer'
import { EVENT_ADD_POST, MessagePayload } from './types'

export const addPostCommand = async (params: Command<AddPostCommandPayload>): Promise<void> => {
  if (params.payload === null || params.payload === undefined) {
    throw new ServiceException('AddPostCommand: payload can\'t be empty')
  }

  if (process.env.POST_EVENT_TOPIC === null || process.env.POST_EVENT_TOPIC === undefined) {
    throw new ServiceException('Post event topic must be defined in .env')
  }

  const topic = process.env.POST_EVENT_TOPIC

  const messagePayload: MessagePayload = {
    event: EVENT_ADD_POST,
    data: params.payload
  }

  await producer.produceMessage(messagePayload, process.env.POST_EVENT_TOPIC)
  console.log(`Message produced to topic: ${topic}, with data: ${JSON.stringify(messagePayload)}`)
}
