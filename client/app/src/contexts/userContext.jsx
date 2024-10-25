import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

const ROLE_HIERARCHY = {
  'worker': 1,
  'librarian': 2,
  'manager': 3,
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("");

  useEffect(() => {
    const checkAndFetchUserInfo = async () => {
      await checkTokenValidity();
      if (localStorage.getItem('access_token')) {
        await fetchUserInfo();
      }
    };
    checkAndFetchUserInfo();
  }, []);
    
  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenValidity();
    }, 3 * 60 * 1000); // Check every 3 minutes
    return () => clearInterval(interval);
  }, []);

  const hasRequiredRole = (minRole) => {
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[minRole];
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setCurrentScreen('login');
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
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
      const tokenExpiryTime = decodedToken.exp - currentTime;

      if (tokenExpiryTime < 5 * 60) {
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

  return (
    <UserContext.Provider value={{currentScreen, setCurrentScreen, hasRequiredRole, handleLogout, user, setUser, checkTokenValidity}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);