import request from 'supertest'
import { Server } from '@/main/Server'
import { MongoHelper } from '@/infra/mongodb/MongoHelper'
import config from '@/main/config'
import { Express } from 'express'
import { randomUUID } from 'crypto'

describe('/auth/signup (e2e)', async () => {
  let systemUnderTests: Express
  beforeAll(async () => {
    await MongoHelper.connect(config.mongoUrl)
    systemUnderTests = new Server().app
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  const userEmail = `${randomUUID()}@mail.com`

  it('should signup user and authenticate', async () => {
    const response = await request(systemUnderTests)
      .post('/auth/signup')
      .send({
        email: userEmail,
        password: '1validpassword',
      })
      .expect(201)

    expect(response.body).toEqual({
      message: 'Signup successful',
      generatedId: expect.any(String),
      accessToken: expect.any(String),
    })
    const accessTokenIsJwt = response.body.accessToken.split('.').length === 3
    expect(accessTokenIsJwt).toBe(true)
  })
  it('should return error when email already in use', async () => {
    const response = await request(systemUnderTests)
      .post('/auth/signup')
      .send({
        email: userEmail,
        password: '1another-password',
      })
      .expect(400)

    expect(response.body).toEqual({
      message: 'Email already in use',
      status: 'error',
    })
  })
})
