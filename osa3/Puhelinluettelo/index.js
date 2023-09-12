const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(morgan('tiny'))

app.use(express.json())

app.use(express.static('build'))

app.use(cors())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

const generateId = () => {
  const randomId = Math.floor((Math.random() * 1000000));
  return randomId + 1
}

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Phonebook</h1>')
})

app.get('/info', (req, res) => {
  const amount = persons.length
  const date = Date().toLocaleString()
  res.send(`<p>Phonebook has info for ${amount} people</p> <p>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
  const existingPerson = persons.find(e => e.name === body.name)

  if(!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }
  if(!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }
  if(existingPerson) {
    return response.status(400).json({
      error: 'person already exists'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  
  console.log()
  console.log(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})