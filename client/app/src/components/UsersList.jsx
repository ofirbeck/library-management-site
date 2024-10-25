import React, { useState, useEffect } from 'react';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [allRoles, setAllRoles] = useState([]);
  const [message, setMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getRoles();
    fetchUsers();
  }, []);

  const getRoles = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/roles/", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setAllRoles(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const userData = { username, password, role };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        setMessage('User added');
        setUsername('');
        setPassword('');
        setRole('');
        fetchUsers();
      } else {
        setMessage('Error adding user');
      }
    } catch (error) {
      setMessage('Error adding user');
    }
  };

  return (
    <div>
      <button onClick={() => setIsDialogOpen(true)}>Add a New worker</button>
      <dialog open={isDialogOpen}>
      <form onSubmit={handleCreateUser}>
      <button type="button" className="secondary" onClick={() => setIsDialogOpen(false)} style={{ float: 'right' }}>X</button>
        <br></br>
        <label htmlFor="name">Username:</label>
          <input
            type="text"
            id="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="" disabled>The user's role</option>
        {allRoles.map((oneRole) => (
          <option key={oneRole} value={oneRole}>
            {oneRole}
          </option>
        ))}
        </select>
        <button type="submit">Add a new worker</button>
        {message && <p>{message}</p>}
      </form>
      </dialog>
      <h2>The library workers</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;