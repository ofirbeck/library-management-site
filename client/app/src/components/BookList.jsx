import React from 'react';
import BookItem from './BookItem';
import useBooks from '../hooks/useBooks';

const BookList = () => {
    const {books, handleNewTitleChange, updateTitle, deleteBook} = useBooks();
  return (
    <div>
      {books.map((book) => (
        <BookItem
          key={book.id}
          book={book}
          handleNewTitleChange={handleNewTitleChange}
          updateTitle={updateTitle}
          deleteBook={deleteBook}
        />
      ))}
    </div>
  );
};

export default BookList;