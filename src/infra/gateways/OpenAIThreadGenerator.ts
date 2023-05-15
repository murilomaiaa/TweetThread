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
    try {
      return this.generateFromRandomModel(transcript)
    } catch (error: any) {
      return this.handleRequestError(error)
    }
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
    const completion = await this.openAI.createChatCompletion({
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

    console.log('gpt-3.5', completion.data.usage?.total_tokens)

    const result = completion.data.choices[0].message?.content
      .split('\n')
      .filter((tweet) => tweet.trim().length > 0)

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

    const result = completion.data.choices[0].text?.split('\n') ?? []
    return result.filter((tweet) => tweet.trim().length > 0)
  }

  private generatePrompt(transcript: string) {
    return `I need a Twitter thread about ${transcript}`
  }

  private handleRequestError(error: any): Promise<string[]> {
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.log('Response Error:', error.response.data)
      console.log('Response Status:', error.response.status)
      console.log('Response Headers:', error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      console.log('Request Error:', error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error:', error.message)
    }
    throw new Error('Failed to fetch AI.')
  }
}
