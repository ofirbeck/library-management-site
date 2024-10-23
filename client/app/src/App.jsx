import '@picocss/pico';
import './App.css'
import React, {useEffect} from 'react';
import { jwtDecode } from "jwt-decode";
import { BooksProvider } from './contexts/booksContext';
import { ClientsProvider } from './contexts/clientsContext';
import { UserProvider, useUser } from './contexts/userContext';
import BookList from './components/BookList';
import BookForm from './components/BookCreateForm';
import Login from './components/Login';
import LibraryCreateForm from './components/LibraryCreateForm';
import ClientsList from './components/ClientsList';
import UsersList from './components/UsersList';

const AppContent = () => {
  const { currentScreen, setCurrentScreen, setUsername} = useUser();

  const handleLogout = () => {
    setUsername('');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setCurrentScreen('login');
  };

  if (!localStorage.getItem('access_token')) {
    return (
      <div>
        <div>
          <button onClick={() => setCurrentScreen("login")}>Login</button>
          <button onClick={() => setCurrentScreen("createLibrary")}>Create a new Library</button>
        </div>
        {currentScreen === "login" && (
          <Login/>
        )}
        {currentScreen === "createLibrary" && (
          <LibraryCreateForm/>
        )}
      </div>
    );
  }
  else {
    return (
      <ClientsProvider>
      {/* <h2>Welcome {user.username} to the {user.libraryName} library</h2> */}
      <button onClick={handleLogout} className="contrast">Logout</button>
      <div className="button-group">
      <button onClick={() => setCurrentScreen('view_books')}>View Books</button>
      <button onClick={() => setCurrentScreen('view_clients')}>View Clients</button>
      <button onClick={() => setCurrentScreen('view_users')}>manage the library's workers</button>
      </div>
      {currentScreen === 'view_books' && (
            <BooksProvider>
              <BookForm/>
              <BookList/>
            </BooksProvider>
          )}
      {currentScreen === 'view_clients' && (
                <ClientsList/>
      )}
      {currentScreen === 'view_users' && (
                <UsersList/>
      )}
      </ClientsProvider>
    );
  }
};

function App() {
  return (
    <UserProvider>
        <h1>Library Manager</h1>
        <AppContent />
    </UserProvider>
  );
}

export default App
