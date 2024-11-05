import envFile from './config/load-env'
import startApp from './app'

console.log(`Environment variables loaded from ${envFile}`)

startApp().then(() => {
  console.log('Social media API server has started...')
}).catch((error) => {
  console.error('Cannot start social media API server', error)
})
