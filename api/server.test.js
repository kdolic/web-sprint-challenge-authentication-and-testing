const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')

test('sanity', () => {
  expect(true).toBe(true)
})

// Set up to handle migrations & destroy test DB before/after each test

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})

describe('server running', () => {
  describe('api running well', () => {
    it("displays successful message of 'API RUNNING' ", async () => {
      const res = await request(server).get('/')
      expect(res.body).toBe('API RUNNING')
    })
  })
})

describe('[POST] /register', () => {
  it('responds with a 201 status', async () => {
    const res = await request(server)
    .post('/api/auth/register')
    .send({username: 'Kenan', password:'abc123'})
    expect(res.status).toBe(201)
  })
  it('register and display new user', async () => {
    const res = await request(server)
    .post('/api/auth/register')
    .send({username: 'Kenan', password:'abc123'})
    expect(res.body).toMatchObject({id: 1, username: 'Kenan'})
  })
})

describe('[POST] /login', () => {
  it('responds with a 200 status', async () => {
    await request(server)
    .post('/api/auth/register')
    .send({username: 'Kenan', password:'abc123'})
    const res = await request(server)
    .post('/api/auth/login')
    .send({username: 'Kenan', password:'abc123'})
    expect(res.status).toBe(200)
  })
  it('respond with a token', async () => {
    await request(server)
    .post('/api/auth/register')
    .send({username: 'Kenan', password:'abc123'})
    const res = await request(server)
    .post('/api/auth/login')
    .send({username: 'Kenan', password:'abc123'})
    expect(res.body.token).toBeTruthy()
  })
})

describe('[GET] /', () => {
  it('responds with 200 status', async () => {
    await request(server)
    .post('/api/auth/register')
    .send({username: 'Kenan', password:'abc123'})
    const res = await request(server)
    .post('/api/auth/login')
    .send({username: 'Kenan', password:'abc123'})
    expect(res.status).toBe(200)
  })
 it('responds with a 401 when login isnt valid', async () => {
    await request(server)
    .post('/api/auth/register')
    .send({username: 'Kenan', password:'abc123'})
    const res = await request(server)
    .post('/api/auth/login')
    .send({username: 'Kenan', password:'123abc'})
    expect(res.status).toBe(401)
 })
})
