import { useState, useEffect } from 'react'
import contactService from './services/contacts'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'


const App = () => {
  const notificationStyle = {
    color: '#38302E',
    background: '#CCDAD1',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 20,
    borderColor: '#788585',
    padding: 10,
    marginBottom: 20,
    paddingLeft: 30,
  }

  const errorStyle = {
    color: '#38302E',
    background: '#E3D3E4',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 20,
    borderColor: '#690500',
    padding: 10,
    marginBottom: 20,
    paddingLeft: 30,
  }

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [message, setMessage] = useState(null)
  const [style, setStyle] = useState(notificationStyle)

  useEffect(() => {
    contactService
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some((person) => person.name.toLowerCase() === newName.toLowerCase())) {
      if (window.confirm(`${newName} is already in phonebook. Do you want to update the number?`)) {
        const person = persons.find(p => p.name === newName)
        const id = person.id
        const changedContact = { ...person, number: newNumber }

        contactService
          .update(id, changedContact)
          .then(returnedContact => {
            setPersons(persons.map(person => person.id !== id ? person : returnedContact))
            setNewName('')
            setNewNumber('')
            setMessage(`${newName}'s phone number updated`)
            setTimeout(() => {
              setMessage(null)
            }, 4000)
          })
          .catch(error => {
            setStyle(errorStyle)
            setMessage(`${newName} has already removed from the server`)
            setTimeout(() => {
              setMessage(null)
              setStyle(notificationStyle)
            }, 4000)
            setPersons(persons.filter(p => p.id !== id))
          })
      } setNewName('')
      setNewNumber('')
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }

      contactService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`${newName} added to phone book`)
          setTimeout(() => {
            setMessage(null)
          }, 4000)
        }).catch(error => {
          console.log(error.response.data.error)
          setStyle(errorStyle)
          setMessage(error.response.data.error)
          setTimeout(() => {
            setMessage(null)
            setStyle(notificationStyle)
          }, 4000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  let personsToShow = showAll
    ? persons
    : persons.filter((person) => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)

    event.target.value.length === 0
      ? setShowAll(true)
      : setShowAll(false)
  }

  const deleteContact = id => {
    const person = persons.filter(person => person.id === id)

    if (window.confirm(`Do you want to delete ${person[0].name} from phonebook?`)) {
      contactService
        .deleteContact(id)
      setPersons(persons.filter(person => person.id !== id))
      setMessage(`${person[0].name} deleted from phone book`)
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    }
  }

  const textColor = {
    color: '#38302E'
  }


  return (
    <div>
      <h1 style={textColor}>Phonebook</h1>
      <Notification message={message} style={style} />
      <Filter text={"filter shown with:"} value={newFilter} onChange={handleFilterChange} />

      <h2 style={textColor}>Add new</h2>

      <PersonForm submit={addPerson} textName={"name:"} nameValue={newName}
        onChangeName={handleNameChange} textNumber="number: "
        valueNumber={newNumber} onChangeNum={handleNumberChange} />

      <h2 style={textColor}>Numbers</h2>
      <ul style={textColor}>
        {personsToShow.map(person =>
          <Person key={person.name}
            name={person.name}
            number={person.number}
            deleteContact={() => deleteContact(person.id)} />
        )}
      </ul>
    </div>
  )

}

const Notification = ({ message, style }) => {

  if (message === null) {
    return null
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

const Person = ({ name, number, deleteContact }) => {

  return (
    <li >{name} {number}   <button onClick={deleteContact}>delete</button></li>
  )
}
export default App

