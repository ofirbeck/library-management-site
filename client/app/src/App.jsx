import { useEffect, useState } from 'react'
import './App.css'
import BookList from './components/BookList';
import BookForm from './components/BookCreateForm';

function App() {
  return (
    <>
      <h1>Library Manager</h1>
      <BookForm/>
      <BookList/>
    </>
  )
}

export default App
