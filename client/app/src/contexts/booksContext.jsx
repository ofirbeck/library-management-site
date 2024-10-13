import { createContext, useContext, useState, useEffect } from 'react';

const BooksContext = createContext();

export const useBooks = () => {
  return useContext(BooksContext);
};

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [newTitles, setNewTitles] = useState({});

  const getBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createNewBook = async (title, author, genre, copies) => {
    const bookData = {
      title: title,
      author: author,
      genre: genre,
      copies_available: copies
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
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

  const updateTitle = async (pk, author, genre, copies) => {
    const newTitle = newTitles[pk];
    const bookData = {
      title: newTitle,
      author: author,
      genre: genre,
      copies_available: copies    
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
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
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "application/json",
        },
      });
      setBooks(books.filter((book) => book.id !== pk));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <BooksContext.Provider value={{ books, createNewBook, handleNewTitleChange, updateTitle, deleteBook }}>
      {children}
    </BooksContext.Provider>
  );
};