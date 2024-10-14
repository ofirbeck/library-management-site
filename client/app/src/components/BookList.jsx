import React, { useState} from 'react';
import BookItem from './BookItem';
import BookSearchBar from './bookSearchBar';
import { useBooks } from '../contexts/booksContext';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

const BookList = () => {
  const booksPerPage = 5; // might add an option to choose how much books are on each page
  const {books, currentBooksPage, setCurrentBooksPage} = useBooks();
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const indexOfLastItem = currentBooksPage * booksPerPage;
  const indexOfFirstItem = indexOfLastItem - booksPerPage;
  const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(books.length / booksPerPage) || 1; 


  const handleNextPage = () => {
    setCurrentBooksPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentBooksPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentBooksPage(1); // MIGHT CHANGE LATER: currently returning the user to page 1 to see the results in the sorted way

    books.sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort/>;
  };

  return (
    <div className="container">
      <BookSearchBar />
      <table role="grid">
        <thead>
          <tr>
            <th onClick={() => handleSort('title')}>
              Title {getSortIcon('title')}
            </th>
            <th onClick={() => handleSort('author')}>
              Author {getSortIcon('author')}
            </th>
            <th onClick={() => handleSort('genre')}>
              Genre {getSortIcon('genre')}
            </th>
            <th onClick={() => handleSort('copies_available')}>
              Copies available {getSortIcon('copies_available')}
            </th>
            <th>Edit options</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((book) => (
            <BookItem key={book.id} book={book} />
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentBooksPage === 1}>
          Previous
        </button>
        <span>
          Page {currentBooksPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentBooksPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;