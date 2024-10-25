import React, { useState, useEffect } from 'react';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/clients/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/clients/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
      });
      if (response.ok) {
        setMessage('Client added');
        setName('');
        setEmail('');
        fetchClients();
      } else {
        const errorData = await response.json();
        setMessage(`Error adding client: ${errorData.email || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage('Error adding client.');
    }
  };

  return (
    <div>
      <button onClick={() => setIsDialogOpen(true)}>Add a New Client</button>
      <dialog open={isDialogOpen}>
      <form onSubmit={handleCreateClient}>
      <button type="button" className="secondary" onClick={() => setIsDialogOpen(false)} style={{ float: 'right' }}>X</button>
        <br></br>
        <label htmlFor="name">Client name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        <button type="submit">Add Client</button>
        {message && <p>{message}</p>}
      </form>
      </dialog>
      <h2>Clients List</h2>
      <ul>
        {clients.map(client => (
          <li key={client.id}>{client.name} - {client.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClientsList;