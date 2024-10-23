import React, { useState, useEffect} from 'react';
import {useUser} from '../contexts/userContext';


const Login = () => {
    const {setUser, setUsername, username, setCurrentScreen} = useUser();
    const [password, setPassword] = useState('');
    const [credsErrorMessage, setCredsErrorMessage] = useState('');

    const handleSubmit = async (event) => {
      event.preventDefault();
      const userData = { username, password };
  
      try {
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
  
        if (response.status === 401) {
          setCredsErrorMessage('Invalid credentials');
        } else if (response.ok) {
          const data = await response.json();
          console.log('Login successful:', data);
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          //localStorage.setItem('user_role', data.user.role);
          setUser(data.user);
          setCredsErrorMessage('');
          setCurrentScreen('view_books');
        } else {
          setCredsErrorMessage('An error occurred. Please try again.');
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        setCredsErrorMessage('An unexpected error occurred. Please try again.');
        console.error('Unexpected error:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {credsErrorMessage && <p>{credsErrorMessage}</p>}
        <button type="submit">Login</button>
      </form>
    );
  };
export default Login;