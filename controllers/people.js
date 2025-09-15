const peopleRouter = require('express').Router()
const Person = require('../models/person')


peopleRouter.get('/', async (request, response) => {
  const people = await Person.find({})
  response.json(people)
})

peopleRouter.get('/info', async (request, response) => {
  const count = await Person.countDocuments({})
  const date = new Date()
  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `)
})

peopleRouter.get('/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

peopleRouter.delete('/:id', async (request, response, next) => {
  try { 
    const result = await Person.findByIdAndDelete(request.params.id)
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

peopleRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  try {
    const savedPerson = await person.save()
    response.status(201).json(savedPerson)
  } catch(exception) {
    next(exception)
  }
})

peopleRouter.put('/:id', async (request, response, next) => {
  try {
    const { name, number } = request.body

    if (!name && !number) {
      return response.status(400).json({ error: 'name or number is required' })
    }

    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
    
    if (updatedPerson) {
      response.json(updatedPerson)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

module.exports = peopleRouter