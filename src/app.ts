import express from 'express'
import router from './routes/routes'
import mongoose from 'mongoose'
import kafka from './producer/producer'
import { initMediators } from './mediator/init'
import file from './utils/file'
import redis from './redis/redis'

const app = express()
app.use('/api', router)

const PORT = process.env.PORT ?? 3000

export default async function startApp (): Promise<void> {
  // connects to mongodb
  await mongoose.connect(process.env.MONGO_URL ?? '')
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB successfully')
  })

  // initialize kafka connections
  await kafka.init()

  // init redis connection
  await redis.init()

  // initialize mediators
  initMediators()

  // initialize file storage
  // ideally uses S3 or similar services to store objects (images, videos, files, etc...)
  file.initDirectories()

  // start app port
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}
