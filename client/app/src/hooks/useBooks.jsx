import { useState, useEffect } from 'react';

const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [newTitles, setNewTitles] = useState({});

  const getBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createNewBook = async (title, releaseYear) => {
    const bookData = {
      title: title,
      year_of_release: releaseYear
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      setBooks([...books, data]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewTitleChange = (bookId, newTitle) => {
    setNewTitles((prevNewTitles) => ({
      ...prevNewTitles,
      [bookId]: newTitle,
    }));
  };

  const updateTitle = async (pk, yearOfRelease) => {
    const newTitle = newTitles[pk];
    const bookData = {
      title: newTitle,
      year_of_release: yearOfRelease
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      setBooks(books.map((book) => (book.id === pk ? data : book)));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBook = async (pk) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, {
        method: "DELETE",
      });
      setBooks(books.filter((book) => book.id !== pk));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return {
    books,
    createNewBook,
    handleNewTitleChange,
    updateTitle,
    deleteBook,
  };
};

export default useBooks;