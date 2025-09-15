const Person = require('../models/person')

const initialPeople = [
  {
    name: 'Sofia',
    number: '1234567890',
  },
  {
    name: 'Manuel',
    number: '0987654321',
  }
]

const nonExistingId = async () => {
  const person = new Person({ name: 'willremovethissoon' })
  await person.save()
  await person.deleteOne()

  return person._id.toString()
}

const peopleInDb = async () => {
  const people = await Person.find({})
  return people.map(person => person.toJSON())
}

module.exports = {
  initialPeople, nonExistingId, peopleInDb
}