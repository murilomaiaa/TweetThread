import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

export default {
  openAIApiKey: process.env.OPEN_AI_API_KEY,
}
