const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://sofiagoycoechea:${password}@cluster0.scznrjl.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Si solo hay contraseña → mostrar todos los contactos
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} 
// Si hay contraseña + nombre + número → agregar contacto
else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} 
// Si los argumentos no coinciden → mensaje de uso
else {
  console.log('usage: node mongo.js <password> [name number]')
  process.exit(1)
}
