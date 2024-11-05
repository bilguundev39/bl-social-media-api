import { createClient } from 'redis'

const client = createClient({ url: process.env.REDIS_URL })

const init = async (): Promise<void> => {
  await client.connect()
}

export default {
  client,
  init
}
