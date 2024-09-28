import React, { useState, useEffect} from 'react';
import {useBooks} from '../contexts/booksContext';


const BookForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [copies, setCopies] = useState("");
  const [allGenres, setAllGenres] = useState([]);

  const {
    createNewBook
  } = useBooks();

  const getGenres = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/genres/");
      const data = await response.json();
      setAllGenres(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGenres();
  }, []);


  return (
    <form onSubmit={() => createNewBook(title, author, genre, copies)}>
      <input
        type="text"
        placeholder="Book title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="The Book's author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
       <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="" disabled>The book's genre</option>
        {allGenres.map((oneGenre) => (
          <option key={oneGenre} value={oneGenre}>
            {oneGenre}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Number of copies available"
        value={copies}
        onChange={(e) => setCopies(e.target.value)}
      />
      <button type="submit">Add Book to the Library</button>
    </form>
  );
};

export default BookForm;