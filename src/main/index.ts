import config from '@/main/config'
import { Server } from './Server'
import { MongoHelper } from '@/infra/mongodb/MongoHelper'

MongoHelper.connect(config.mongoUrl)
  .then(async () => {
    const server = new Server()

    await server.start(config.port)
  })
  .catch(console.log)
