import React from 'react';
import BookItem from './BookItem';
import {useBooks} from '../contexts/booksContext';

const BookList = () => {
    const {
        books,
        } = useBooks();
  return (
    <div className="container">
      <table role="grid">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Copies available</th>
            <th>Edit options</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <BookItem key={book.id} book={book} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;