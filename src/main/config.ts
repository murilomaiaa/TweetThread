import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

export default {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  openAIApiKey: process.env.OPEN_AI_API_KEY,
  mongoUrl: process.env.MONGO_URL ?? '',
  jwtSecret: process.env.JWT_SECRET,
}
