const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Person = require('../models/person')

const initialPeople = [
  {
    name: 'Sofia',
    number: '1234567890',
  },
  {
    name: 'Manuel',
    number: '0987654321',
  },
]


beforeEach(async () => {
  await Person.deleteMany({})
  let personObject = new Person(initialPeople[0])
  await personObject.save()
  personObject = new Person(initialPeople[1])
  await personObject.save()
})


test('people are returned as json', async () => {
  await api
    .get('/api/people')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two people', async () => {
    const response = await api.get('/api/people')
  
    assert.strictEqual(response.body.length, initialPeople.length)
})
  
test('the first person is Sofia', async () => {
    const response = await api.get('/api/people')
  
    const contents = response.body.map(e => e.name)
    assert(contents.includes('Sofia'))
})

after(async () => {
  await mongoose.connection.close()
})