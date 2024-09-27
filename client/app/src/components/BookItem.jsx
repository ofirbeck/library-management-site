import React from 'react';
import {useBooks} from '../contexts/booksContext';


const BookItem = ({book}) => {
    const {
         handleNewTitleChange,
         updateTitle,
         deleteBook,
       } = useBooks();
    return (
    <div>
      <h4>Title: {book.title}</h4>
      <p>Year of release: {book.year_of_release}</p>
      <input
        type="text"
        placeholder="New title"
        onChange={(e) => handleNewTitleChange(book.id, e.target.value)}
      />
      <button onClick={() => updateTitle(book.id, book.year_of_release)}>Update the title</button>
      <button onClick={() => deleteBook(book.id)}>Delete</button>
    </div>
  );
};

export default BookItem;