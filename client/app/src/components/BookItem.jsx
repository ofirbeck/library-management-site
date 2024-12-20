import React from 'react';
import {useBooks} from '../contexts/booksContext';
import {useUser} from '../contexts/userContext';

import CopiesList from './CopiesList';

const BookItem = ({book}) => {
    const {
         handleNewTitleChange,
         updateTitle,
         deleteBook,
       } = useBooks();
    const {hasRequiredRole} = useUser();
    return (
    <tr>
      <td>
      <CopiesList bookId={book.id} />
      </td>
      <td>{book.title} </td>
      <td>{book.author} </td>
      <td>{book.genre} </td>
      <td>{book.copies_available}</td>
      {hasRequiredRole('manager') && (
      <td>
      <input
        type="text"
        placeholder="New title"
        onChange={(e) => handleNewTitleChange(book.id, e.target.value)}
      />
      <button onClick={() => updateTitle(book.id, book.author, book.genre, book.copies_available)} className="primary">
          Update the title
        </button>
        <button onClick={() => deleteBook(book.id)} className="contrast">
          Delete
        </button>
      </td>
    )}
    </tr>
  );
};

export default BookItem;