import request from 'supertest'
import { Server } from '@/main/Server'
import { MongoHelper } from '@/infra/mongodb/MongoHelper'
import config from '@/main/config'
import { Express } from 'express'
import { randomUUID } from 'crypto'

describe('/auth/login (e2e)', async () => {
  let systemUnderTests: Express
  const userEmail = `${randomUUID()}@mail.com`
  const userPassword = '1validpassword'

  beforeAll(async () => {
    await MongoHelper.connect(config.mongoUrl)
    systemUnderTests = new Server().app
    await request(systemUnderTests).post('/auth/signup').send({
      email: userEmail,
      password: userPassword,
    })
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should return JWT accessToken', async () => {
    const response = await request(systemUnderTests)
      .post('/auth/login')
      .send({
        email: userEmail,
        password: userPassword,
      })
      .expect(200)

    expect(response.body).toEqual({
      message: 'Login successful',
      accessToken: expect.any(String),
    })
    const accessTokenIsJwt = response.body.accessToken.split('.').length === 3
    expect(accessTokenIsJwt).toBe(true)
  })

  it('should return error with invalid password', async () => {
    const response = await request(systemUnderTests)
      .post('/auth/login')
      .send({
        email: userEmail,
        password: 'invalid-password',
      })
      .expect(400)

    expect(response.body).toEqual({
      message: 'Invalid email/password',
      status: 'error',
    })
  })
})
