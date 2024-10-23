import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [libraryName, setLibraryName] = useState("");
  const [currentScreen, setCurrentScreen] = useState("");

  useEffect(() => {
    checkTokenValidity();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenValidity();
    }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setUsername(data.username);
        setLibraryName(data.library.name);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setUser(null);
    }
  };

  const checkTokenValidity = async () => {
    const token = localStorage.getItem('access_token');
    if(!token) {
      setCurrentScreen('login');
      setUser(null);
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
            fetchUserInfo()
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

  return (
    <UserContext.Provider value={{currentScreen, setCurrentScreen, user, setUser, username, setUsername, libraryName, setLibraryName, checkTokenValidity}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);