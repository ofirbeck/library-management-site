import '@picocss/pico';
import './App.css'
import { BooksProvider } from './contexts/booksContext';
import BookList from './components/BookList';
import BookForm from './components/BookCreateForm';

function App() {
  return (
    <>
      <h1>Library Manager</h1>
      <BooksProvider>
      <BookForm/>
      <BookList/>
      </BooksProvider>
    </>
  )
}

export default App
