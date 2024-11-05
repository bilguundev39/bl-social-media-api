import mongoose from 'mongoose'
import { Query } from '../mediator/types'
import { PresignedUrl } from './types'
import redis from '../redis/redis'

export const queryPresignedUrl = async (_params: Query): Promise<PresignedUrl> => {
  const fileId = new mongoose.Types.ObjectId()
  const baseUrl = process.env.FILE_BASE_URL ?? ''
  const url = `${baseUrl}api/upload/${fileId.toString()}`

  const expires = 60 * 60 // 1 hour
  await redis.client.set(fileId.toString(), url, {
    EX: expires
  })

  return { url }
}
