import config from '@/main/config'
import { Server } from './Server'
import { MongoHelper } from '@/infra/mongodb/MongoHelper'

MongoHelper.connect(config.mongoUrl ?? '')
  .then(() => {
    const server = new Server()

    server.start(config.port).then(() => {
      console.log(`App running on port: ${config.port}`)
    })
  })
  .catch(console.log)
