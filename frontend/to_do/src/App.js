import { useEffect, useState } from 'react'
import './App.css';
import axios from "axios";
function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");

  const fetchBooks = () => {
    axios.get("http://127.0.0.1:8000/api/books/")
      .then(response => {
        const data = response.data
        setBooks(data)
      })
      .catch(error => console.log(error))
  }
  const addBook = () => {
    const bookData = {
      title: title,
      release_year: releaseYear
    }
    axios.post("http://127.0.0.1:8000/api/books/create/", bookData, {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      "Vary": "Accept"
    }).then(response => {
      const data = response.data;
      setBooks(prevData => [...prevData, data])
      setTitle("")
      setReleaseYear("")
    }
    )
  }
  const [newTitle, setNewTitle] = useState("")
  const handleUpdate = (id, release_year) => {
    const updatedBookData = {
      title: newTitle,
      release_year: release_year
    }
    axios.put(`http://127.0.0.1:8000/api/books/${id}`, updatedBookData).then(response => {
      const data = response.data;
      setBooks(prevData => prevData.map(book => {
        if (book.id === id) {
          return data
        }
        else {
          return book;
        }
      }))
    })

  }
  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/books/${id}`).then(response => {
      const data = response.data;
      setBooks(prevData => prevData.filter(book => book.id != id))
    }).catch(error => console.log(error))
  }
  useEffect(() => {
    fetchBooks()
  }, [])
  return (
    <div className="App">
      <h1>Books Website</h1>
      <div>
        <h2>Add a book</h2>
        <input type="text" placeholder="Book title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Release date" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} />
        <button onClick={addBook}>Add Book</button>
      </div>
      <div>
        <h2>Available books</h2>
        {
          books.map(book => <div key={book.id}>
            <span>{book.title}</span> - <span>{book.release_year} </span>
            <div>
              <input type='text' placeholder='Update title' onChange={(e) => setNewTitle(e.target.value)} />
              <button onClick={() => handleUpdate(book.id, book.release_year)}>Update</button></div>
            <button onClick={() => handleDelete(book.id)}>Delete</button>
          </div>)
        }
      </div>
    </div>
  );
}

export default App;
