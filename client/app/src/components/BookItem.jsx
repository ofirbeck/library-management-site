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
      <p>
      Author: {book.author} <br />
      Genre: {book.genre} <br />
      Copies available: {book.copies_available}
      </p>
      <input
        type="text"
        placeholder="New title"
        onChange={(e) => handleNewTitleChange(book.id, e.target.value)}
      />
      <button onClick={() => updateTitle(book.id, book.author, book.genre, book.copies_available)}>Update the title</button>
      <button onClick={() => deleteBook(book.id)}>Delete</button>
    </div>
  );
};

export default BookItem;