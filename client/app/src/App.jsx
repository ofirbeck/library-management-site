import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <>
      <h1>Book archive</h1>
      <div>
        <input type="text" placeholder="Book title" />
        <input type="number" placeholder="Release Date"/>
        <button>Add Book to the archive</button>

      </div>
    </>
  )
}

export default App
