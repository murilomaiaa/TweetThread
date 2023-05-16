import request from 'supertest'
import { Server } from '@/main/Server'
import { MongoHelper } from '@/infra/mongodb/MongoHelper'
import config from '@/main/config'
import { Express } from 'express'
import { randomUUID } from 'crypto'

const OpenAIApiMock = vi.fn().mockResolvedValue({
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
            "3/ Riding motorcycles can also be a great stress reliever. When you're on the road, it's just you, the bike, and the open road. It's a great way to clear your mind and escape from the stresses of everyday life.\n" +
            '\n' +
            "4/ Riding motorcycles also requires a great deal of skill and focus. A rider needs to be aware of their surroundings at all times and be able to react quickly to changing road conditions. It's a challenge that keeps riders engaged and on their toes.\n" +
            '\n' +
            "5/ While riding motorcycles can be risky, it's important to remember that with the right training and safety gear, it can be done safely. It's important for riders to always wear a helmet and protective clothing, and to follow traffic laws and ride defensively.\n" +
            '\n' +
            "6/ At the end of the day, riding motorcycles is about the joy of the ride. It's about experiencing the world in a whole new way and feeling alive. If you've never experienced it, I encourage you to give it a try. You might just discover a new passion. #motorcycle #riding #freedom",
        },
        finish_reason: 'stop',
        index: 0,
      },
    ],
  },
})

vi.mock('openai', () => ({
  Configuration: vi.fn(),
  OpenAIApi: vi.fn().mockImplementation(() => ({
    createChatCompletion: OpenAIApiMock,
  })),
}))

describe('/tweet-threads POST (e2e)', async () => {
  let systemUnderTests: Express
  const userEmail = `${randomUUID()}@mail.com`
  const userPassword = '1validpassword'
  let accessToken: string

  beforeAll(async () => {
    await MongoHelper.connect(config.mongoUrl)
    systemUnderTests = new Server().app
    const { body } = await request(systemUnderTests).post('/auth/signup').send({
      email: userEmail,
      password: userPassword,
    })

    accessToken = `Bearer ${body.accessToken}`

    vi.spyOn(Math, 'random').mockReturnValue(1)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should return 401 when authentication is not provided', async () => {
    await request(systemUnderTests)
      .post('/tweet-threads')
      .send({
        transcript: 'any transcript',
      })
      .expect(401)
  })

  it('should return 400 when transcript is not provided', async () => {
    await request(systemUnderTests)
      .post('/tweet-threads')
      .set('authorization', accessToken)
      .send({})
      .expect(400)
  })

  it('should return 201 with created thread', async () => {
    const { body } = await request(systemUnderTests)
      .post('/tweet-threads')
      .set('authorization', accessToken)
      .send({
        transcript: 'motorcycles',
      })
      .expect(201)

    expect(body).toEqual({
      tweets: [
        "1/ Riding motorcycles is not just a mode of transportation, it's an experience that can't be matched by any other vehicle. The feeling of freedom and connection to the road is something that can only be understood by those who have done it.",
        "2/ The sound of a motorcycle engine revving up is a symphony for the ears, and the feeling of the wind in your face is unmatched by any other vehicle. It's an incredible feeling of being alive and in the moment.",
        "3/ Riding motorcycles can also be a great stress reliever. When you're on the road, it's just you, the bike, and the open road. It's a great way to clear your mind and escape from the stresses of everyday life.",
        "4/ Riding motorcycles also requires a great deal of skill and focus. A rider needs to be aware of their surroundings at all times and be able to react quickly to changing road conditions. It's a challenge that keeps riders engaged and on their toes.",
        "5/ While riding motorcycles can be risky, it's important to remember that with the right training and safety gear, it can be done safely. It's important for riders to always wear a helmet and protective clothing, and to follow traffic laws and ride defensively.",
        "6/ At the end of the day, riding motorcycles is about the joy of the ride. It's about experiencing the world in a whole new way and feeling alive. If you've never experienced it, I encourage you to give it a try. You might just discover a new passion. #motorcycle #riding #freedom",
      ],
    })
  })

  it('should return 500 when openAI api throws', async () => {
    OpenAIApiMock.mockRejectedValueOnce(new Error())

    await request(systemUnderTests)
      .post('/tweet-threads')
      .set('authorization', accessToken)
      .send({
        transcript: 'motorcycles',
      })
      .expect(500)
  })
})
