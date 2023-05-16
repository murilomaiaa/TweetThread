import { ThreadGenerator } from '@/application/gateways/ThreadGenerator'
import config from '@/main/config'
import { Configuration, OpenAIApi } from 'openai'

export class OpenAIThreadGenerator implements ThreadGenerator {
  private readonly openAI: OpenAIApi

  constructor() {
    const configuration = new Configuration({
      apiKey: config.openAIApiKey,
    })

    this.openAI = new OpenAIApi(configuration)
  }

  async generate(transcript: string): Promise<string[]> {
    return this.generateFromRandomModel(transcript)
  }

  private async generateFromRandomModel(transcript: string) {
    const randomNumber = Math.random()
    if (randomNumber < 0.2) {
      // $0.0200 / 1K tokens
      return this.generateTweetsFromCompletion(transcript, 'text-davinci-003')
    }

    // $0.002 / 1K tokens
    return this.generateTweetsFromGPT(transcript)
  }

  // https://platform.openai.com/docs/guides/chat/introduction
  private async generateTweetsFromGPT(transcript: string) {
    const prompt = this.generatePrompt(transcript)
    const { data } = await this.openAI.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.8,
      max_tokens: 2500,
      messages: [
        { role: 'system', content: 'You are a Twitter Thread generator.' },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    console.log('gpt-3.5', data.usage?.total_tokens)

    const result = data.choices[0].message?.content
      .split('\n')
      .filter((tweet) => tweet.trim().length > 0)
      // The first line is "Sure, here's a thread about..."
      .slice(1)

    /* istanbul ignore else */
    return result ?? []
  }

  // https://platform.openai.com/docs/guides/completion/introduction
  private async generateTweetsFromCompletion(
    transcript: string,
    model: string,
  ) {
    const prompt = this.generatePrompt(transcript)

    const completion = await this.openAI.createCompletion({
      model,
      prompt,
      temperature: 0.8,
      max_tokens: 1000,
    })

    console.log(model, completion.data.usage?.total_tokens)

    /* istanbul ignore else */
    const result = completion.data.choices[0].text?.split('\n') ?? []
    return result.filter((tweet) => tweet.trim().length > 0)
  }

  private generatePrompt(transcript: string) {
    return `I need a Twitter thread about ${transcript}`
  }
}
