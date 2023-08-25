import { useState, useEffect } from 'react'

import personService from './services/persons'

const Person = ({ person, deletePerson }) => {
  return (
    <p>
      {person.name} {person.number}{''}
      <button onClick={deletePerson}>delete</button>
    </p>
  )
}

const FilterInput = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with<input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <h2>add a new</h2>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange} />
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(e => e.name === newName)) {
      window.alert(`${newName} is already added to phonebook`)
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(response => {
          console.log(response)
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleDelete = (person, id) => {
    if (window.confirm(`Delete ${person.name}`)) {
      personService
        .deletePerson(id)
        .then(response => {
          console.log(response)
        })
        .then(personService
          .getAll()
          .then(response => {
            setPersons(persons.filter(person => person.id !== id));
          }))
        }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }



  const personsToDisplay =
    filter === null
      ? persons
      : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterInput filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>

      {personsToDisplay.map(person =>
        <div>
          <Person
            key={person.name}
            person={person}
            deletePerson={() => handleDelete(person.id)}
          />
        </div>
      )}

    </div>
  )
}

export default App