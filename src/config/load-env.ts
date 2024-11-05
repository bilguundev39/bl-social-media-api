import dotenv from 'dotenv'

// Load environment variables based on the environment (e.g., .env.dev, .env.prod)
const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev'
dotenv.config({ path: envFile })

export default envFile
