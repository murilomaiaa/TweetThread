import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

export default {
  openAIApiKey: process.env.OPEN_AI_API_KEY,
  mongoUrl: process.env.MONGO_URL,
}
