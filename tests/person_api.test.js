const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Person = require('../models/person')

beforeEach(async () => {
  await Person.deleteMany({})

  const personObjects = helper.initialPeople
    .map(person => new Person(person))
  const promiseArray = personObjects.map(person => person.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some people saved', () => {
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

  test('a person has id property instead of _id', async () => {
    const response = await api.get('/api/people')
    
    const person = response.body[0]
    assert.strictEqual(typeof person.id, 'string')
    assert.strictEqual(person._id, undefined)
  })

  test('the first person is Sofia', async () => {
    const response = await api.get('/api/people')

    const contents = response.body.map(e => e.name)
    assert(contents.includes('Sofia'))
  })
})

describe('viewing a specific person', () => {
  test('succeeds with a valid id', async () => {
    const peopleAtStart = await helper.peopleInDb()

    const personToView = peopleAtStart[0]

    const resultPerson = await api
      .get(`/api/people/${personToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultPerson.body, personToView)
  })

  test('fails with statuscode 404 if person does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/people/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/people/${invalidId}`)
      .expect(400)
  })
})

describe('adding a new person', () => {
  test('succeeds with valid data', async () => {
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

  test('fails with status code 400 if data invalid', async () => {
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

  test('fails with status code 400 if name is too short', async () => {
    const newPerson = {
      name: 'Jo',
      number: '1234567890',
    }

    await api
      .post('/api/people')
      .send(newPerson)
      .expect(400)

    const peopleAtEnd = await helper.peopleInDb()
    assert.strictEqual(peopleAtEnd.length, helper.initialPeople.length)
  })
})

describe('deleting a person', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const peopleAtStart = await helper.peopleInDb()
    const personToDelete = peopleAtStart[0]

    await api
      .delete(`/api/people/${personToDelete.id}`)
      .expect(204)

    const peopleAtEnd = await helper.peopleInDb()

    const contents = peopleAtEnd.map(r => r.name)
    assert(!contents.includes(personToDelete.name))

    assert.strictEqual(peopleAtEnd.length, helper.initialPeople.length - 1)
  })

  test('fails with statuscode 404 if person does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .delete(`/api/people/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .delete(`/api/people/${invalidId}`)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})