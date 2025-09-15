const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
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
  let personObject = new Person(helper.initialPeople[0])
  await personObject.save()
  personObject = new Person(helper.initialPeople[1])
  await personObject.save()
})

test('people are returned as json', async () => {
  await api
    .get('/api/people')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all people are returned', async () => {
    const response = await api.get('/api/people')
    assert.strictEqual(response.body.length, helper.initialPeople.length)
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

test('a valid person can be added ', async () => {
    const newPerson = {
      name: 'Johnn',
      number: '1234567890',
    }
  
    await api
      .post('/api/people')
      .send(newPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const peopleAtEnd = await helper.peopleInDb()
    assert.strictEqual(peopleAtEnd.length, helper.initialPeople.length + 1)

    const contents = peopleAtEnd.map(p => p.name)
    assert(contents.includes('Johnn'))
})

test('person without name is not added', async () => {
    const newPerson = {
      number: '1234567890',
    }
  
    await api
      .post('/api/people')
      .send(newPerson)
      .expect(400)
  
    const peopleAtEnd = await helper.peopleInDb()

    assert.strictEqual(peopleAtEnd.length, helper.initialPeople.length)
  })
after(async () => {
  await mongoose.connection.close()
})