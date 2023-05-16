import request from 'supertest'
import { Server } from '@/main/Server'
import { MongoHelper } from '@/infra/mongodb/MongoHelper'
import config from '@/main/config'
import { Express } from 'express'
import { randomUUID } from 'crypto'

vi.mock('openai', () => ({
  Configuration: vi.fn(),
  OpenAIApi: vi.fn().mockImplementation(() => ({
    createChatCompletion: vi.fn().mockImplementation(async () => ({
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
                `1/ ${randomUUID()}.\n` +
                '\n' +
                `2/ ${randomUUID()}.\n` +
                '\n' +
                `2/ ${randomUUID()}.\n`,
            },
            finish_reason: 'stop',
            index: 0,
          },
        ],
      },
    })),
  })),
}))

describe('/tweet-threads GET (e2e)', async () => {
  let systemUnderTests: Express
  const userEmail = `${randomUUID()}@mail.com`
  const userPassword = '1validpassword'
  let accessToken: string

  beforeAll(async () => {
    await MongoHelper.connect(config.mongoUrl)
    systemUnderTests = new Server().app

    // Insert user
    const {
      body: { accessToken: responseToken },
    } = await request(systemUnderTests).post('/auth/signup').send({
      email: userEmail,
      password: userPassword,
    })
    accessToken = `Bearer ${responseToken}`

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
      .get('/tweet-threads')
      .send({
        email: userEmail,
        password: userPassword,
      })
      .expect(401)
  })

  it('should return 200 with created threads', async () => {
    const userThreads = []
    // Create 2 threads
    const response1 = await request(systemUnderTests)
      .post('/tweet-threads')
      .set('authorization', accessToken)
      .send({
        transcript: 'motorcycles',
      })
    const response2 = await request(systemUnderTests)
      .post('/tweet-threads')
      .set('authorization', accessToken)
      .send({
        transcript: 'cars',
      })

    const { body } = await request(systemUnderTests)
      .get('/tweet-threads')
      .set('authorization', accessToken)
      .expect(200)

    userThreads.push(
      {
        tweets: response1.body.tweets,
        transcript: 'motorcycles',
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        tweets: response2.body.tweets,
        transcript: 'cars',
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    )

    const expected = {
      threads: body.threads.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      })),
    }
    expect(expected).toEqual({ threads: userThreads })
  })
})
