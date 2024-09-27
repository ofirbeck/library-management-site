import React, { useState } from 'react';
import useBooks from '../hooks/useBooks';


const BookForm = () => {
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const {
    createNewBook
  } = useBooks();

  return (
    <form onSubmit={() => createNewBook(title, releaseYear)}>
      <input
        type="text"
        placeholder="Book title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Release Date"
        value={releaseYear}
        onChange={(e) => setReleaseYear(e.target.value)}
      />
      <button type="submit">Add Book to the Library</button>
    </form>
  );
};

export default BookForm;