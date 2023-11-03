import './index.css'
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
  const [message, setMessage] = useState(null)
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(e => e.name === newName);
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook. Replace the old number with the new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        personService
          .update(existingPerson.id, updatedPerson)
          .then(updated => {
            setPersons(persons.map(p => (p.id !== existingPerson.id ? p : updated)))
            setNewName('')
            setNewNumber('')
            setMessage(`Updated ${newName}'s number`)
            setErrorMsg('')
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            console.error('Error updating person:', error)
            setMessage('Error updating person. Please try again later.')
            setErrorMsg('error')
          })
      }

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
          setMessage(`Added ${newName}`)
          setErrorMsg('')
          setTimeout(() => {
            setMessage(null)
          }, 5000)

        })
        .catch(error => {
          console.error('Error adding person:', error)
          console.log(error.response.data)
          if (error.response.status === 400) {
            setMessage(error.response.data.error)
          } else {
            setMessage(`Error adding ${newName}`)
          }
          setErrorMsg('error')
        });
    }
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id);
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          personService.getAll()
            .then(updatedPersons => {
              setPersons(updatedPersons);
              setMessage(`Deleted ${personToDelete.name}`)
              setErrorMsg('')
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            })
            .catch(error => {
              console.error('Error fetching updated persons:', error);
              setMessage(`Information of ${personToDelete} has already been removed from server.`);
              setErrorMsg("error")
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            });
        })
        .catch(error => {
          console.error('Error deleting person:', error);
          setMessage(`Error deleting ${personToDelete}`);
          setErrorMsg("error")
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        });
    }
  };

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
      <h2>Phonebook!</h2>
      <div className={`${errorMsg ? 'error' : 'success'}`}>
        {message}
      </div>
      <FilterInput filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>

      {personsToDisplay.map(person =>
        <div key={person.id}>
          <Person
            person={person}
            deletePerson={() => handleDelete(person.id)}
          />
        </div>
      )}

    </div>
  )
}

export default App