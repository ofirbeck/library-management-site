import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const getBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.log(error);
    }
  }

  const createNewBook = async () => {
      const bookData = {
        title: title,
        year_of_release: releaseYear
      };
      try {
        const response = await fetch("http://127.0.0.1:8000/api/books/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookData),
        });
        const data = await response.json();
        setBooks([...books, data]);
    }
    catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getBooks();
  }, []);

  return (
    <>
      <h1>Book archive</h1>
      <div>
        <input type="text" placeholder="Book title" onChange={(e) => setTitle(e.target.value)}/>
        <input type="number" placeholder="Release Date" onChange={(e) => setReleaseYear(e.target.value)}/>
        <button onClick={createNewBook}>Add Book to the archive</button>
      </div>
      {books.map((book) => (
        <div>
          <h4>Title: {book.title}</h4>
          <p>Year of release: {book.year_of_release}</p>
        </div>
      ))}
    </>
  )
}

export default App
