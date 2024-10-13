import React, { useState } from 'react';
import {useUser} from '../contexts/userContext';

const LibraryCreateForm = () => {
  const {setUsername, username, libraryName, setLibraryName} = useUser();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const libraryData = {
      library_name: libraryName,
      library_address: address,
      admin_username: username,
      admin_password: adminPassword,
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/libraries/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(libraryData)
      });
      if (response.ok) {
        setMessage('Library created successfully!');
        setLibraryName('');
        setAddress('');
        setUsername('');
        setAdminPassword('');
      } else {
        setMessage('Error creating library.');
      }
    } catch (error) {
      setMessage('Error creating library.');
    }
  };

  return (
    <div>
      <h2>Create a New Library</h2>
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <div>
            <label>Library Name:</label>
            <input
              type="text"
              value={libraryName}
              onChange={(e) => setLibraryName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Library Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <button type="submit">Continue</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Admin Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Admin Password:</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create Library</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default LibraryCreateForm;