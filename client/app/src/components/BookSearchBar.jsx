import React from 'react';
import { useBooks } from '../contexts/booksContext';

const BookSearchBar = ({}) => {
    const { searchFor, setSearchFor} = useBooks();
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchFor(value);
      };
    return (
    <input
        type="text"
        placeholder="Search books by title, author, or genre..."
        value={searchFor}
        onChange={handleSearch}
        className="search-bar"
    />
  );
};

export default BookSearchBar;