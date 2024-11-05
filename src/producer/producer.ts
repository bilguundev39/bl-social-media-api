import { Kafka } from 'kafkajs'
import { ServiceException } from '../exceptions/service-exception'
import { kafkaConfig } from '../config/kafka-config'

const kafka = new Kafka(kafkaConfig())

const producer = kafka.producer()
const admin = kafka.admin()

const init = async (): Promise<void> => {
  await producer.connect()
  await admin.connect()
}

const getTopics = async (): Promise<string[]> => {
  return await admin.listTopics()
}

const produceMessage = async (message: Record<string, any>, topic: string): Promise<void> => {
  const kafkaTopics = await getTopics()
  if (!kafkaTopics.includes(topic)) {
    throw new ServiceException(`Given topic: ${topic} is not listed in kafka topics`)
  }

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }]
  })

  return await Promise.resolve()
}

export default {
  kafka,
  producer,
  admin,
  init,
  getTopics,
  produceMessage
}
