import { OpenAIThreadGenerator } from './OpenAIThreadGenerator'

const createChatCompletionMock = vi.fn().mockResolvedValue({
  data: {
    usage: {
      prompt_tokens: 27,
      completion_tokens: 289,
      total_tokens: 316,
    },
    choices: [
      {
        message: {
          role: 'assistant',
          content:
            'Thread: The Joy of Riding Motorcycles\n' +
            '\n' +
            "1/ Riding motorcycles is not just a mode of transportation, it's an experience that can't be matched by any other vehicle. The feeling of freedom and connection to the road is something that can only be understood by those who have done it.\n" +
            '\n' +
            "2/ The sound of a motorcycle engine revving up is a symphony for the ears, and the feeling of the wind in your face is unmatched by any other vehicle. It's an incredible feeling of being alive and in the moment.\n" +
            '\n' +
            "3/ Riding motorcycles can also be a great stress reliever. When you're on the road, it's just you, the bike, and the open road. It's a great way to clear your mind and escape from the stresses of everyday life.\n",
        },
        finish_reason: 'stop',
        index: 0,
      },
    ],
  },
})

const createCompletionMock = vi.fn().mockResolvedValue({
  data: {
    usage: { total_tokens: 100 },
    choices: [
      {
        text:
          "1/ Riding motorcycles is not just a mode of transportation, it's an experience that can't be matched by any other vehicle. The feeling of freedom and connection to the road is something that can only be understood by those who have done it.\n" +
          '\n' +
          "2/ The sound of a motorcycle engine revving up is a symphony for the ears, and the feeling of the wind in your face is unmatched by any other vehicle. It's an incredible feeling of being alive and in the moment.\n",
      },
    ],
  },
})

vi.mock('openai', () => ({
  Configuration: vi.fn(),
  OpenAIApi: vi.fn().mockImplementation(() => ({
    createChatCompletion: createChatCompletionMock,
    createCompletion: createCompletionMock,
  })),
}))

describe('OpenAIThreadGenerator', () => {
  let systemUnderTests: OpenAIThreadGenerator

  beforeAll(() => {
    systemUnderTests = new OpenAIThreadGenerator()
    vi.spyOn(Math, 'random').mockReturnValue(0.2)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return parsed tweets', async () => {
    const tweets = await systemUnderTests.generate('jiu jitsu')

    expect(tweets).toEqual([
      "1/ Riding motorcycles is not just a mode of transportation, it's an experience that can't be matched by any other vehicle. The feeling of freedom and connection to the road is something that can only be understood by those who have done it.",
      "2/ The sound of a motorcycle engine revving up is a symphony for the ears, and the feeling of the wind in your face is unmatched by any other vehicle. It's an incredible feeling of being alive and in the moment.",
      "3/ Riding motorcycles can also be a great stress reliever. When you're on the road, it's just you, the bike, and the open road. It's a great way to clear your mind and escape from the stresses of everyday life.",
    ])
  })

  it('should generate from davinci completion when random number is less than 0.2', async () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.1999)

    const tweets = await systemUnderTests.generate('jiu jitsu')

    expect(tweets).toEqual([
      "1/ Riding motorcycles is not just a mode of transportation, it's an experience that can't be matched by any other vehicle. The feeling of freedom and connection to the road is something that can only be understood by those who have done it.",
      "2/ The sound of a motorcycle engine revving up is a symphony for the ears, and the feeling of the wind in your face is unmatched by any other vehicle. It's an incredible feeling of being alive and in the moment.",
    ])
  })
})
