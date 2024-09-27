import React from 'react';
import BookItem from './BookItem';
import {useBooks} from '../contexts/booksContext';

const BookList = () => {
    const {
        books,
        handleNewTitleChange, 
        updateTitle, 
        deleteBook
        } = useBooks();
  return (
    <div>
      {books.map((book) => (
        <BookItem
          key={book.id}
          book={book}
        />
      ))}
    </div>
  );
};

export default BookList;