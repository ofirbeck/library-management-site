import '@picocss/pico';
import './App.css'
import React, {useEffect} from 'react';
import { jwtDecode } from "jwt-decode";
import { BooksProvider } from './contexts/booksContext';
import { ClientsProvider } from './contexts/clientsContext';
import { UserProvider, useUser } from './contexts/userContext';
import { UIProvider, useUI } from './contexts/UIContext';
import BookList from './components/BookList';
import BookForm from './components/BookCreateForm';
import Login from './components/Login';
import LibraryCreateForm from './components/LibraryCreateForm';
import ClientsList from './components/ClientsList';

const AppContent = () => {
  const { currentScreen, setCurrentScreen } = useUI();
  const { setUsername} = useUser();
  const checkTokenValidity = async () => {
    const token = localStorage.getItem('access_token');
    if(!token) {
      setCurrentScreen('login');
      return;
    }
    else {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            setCurrentScreen('view_books');
          } else {
            // Refresh token is invalid, delete tokens and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setCurrentScreen('login');
          }
        } else {
          // No refresh token, delete access token and redirect to login
          localStorage.removeItem('access_token');
          setCurrentScreen('login');
        }
      } else {
      setCurrentScreen('view_books');
      }
    }
  };

  useEffect(() => {
    checkTokenValidity();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenValidity();
    }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
      </ClientsProvider>
    );
  }
};

function App() {
  return (
    <UserProvider>
      <UIProvider>
        <h1>Library Manager</h1>
        <AppContent />
      </UIProvider>
    </UserProvider>
  );
}

export default App
