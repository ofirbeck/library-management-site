import React, { useState, useEffect } from 'react';
import { useClients } from '../contexts/clientsContext';

const CopiesList = ({ bookId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copies, setCopies] = useState([]);
  const { fetchClients, clients } = useClients();

  const handleOpenCopies = () => {
    setIsDialogOpen(true);
    fetchClients();
    fetchCopies();
  };

  const fetchCopies = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${bookId}/copies/`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCopies(data);
    } catch (error) {
      console.error("Error fetching copies:", error);
    }
  };

  const handleBorrow = async (copyId, clientId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/copies/borrow/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ copy_id: copyId, client_id: clientId })
      });
      if (!response.ok) {
        throw new Error('Failed to borrow book');
      }
      const data = await response.json();
      fetchCopies();
      return data;
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const handleReturn = async (copyId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/copies/return/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ copy_id: copyId })
      });
      if (!response.ok) {
        throw new Error('Failed to return book');
      }
      const data = await response.json();
      fetchCopies();
      return data;
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  return (
    <div>
    <button onClick={() => handleOpenCopies()}>Show Copies</button>
    <dialog open={isDialogOpen}>
    <div className="popup">
    <button type="button" className="secondary" onClick={() => setIsDialogOpen(false)} style={{ float: 'right' }}>X</button>
    <h3>Borrowed Copies</h3>
    {copies.filter(copy => copy.is_borrowed).map(copy => (
    <div key={copy.id}>
        <p>Copy ID: {copy.id}</p>
        <p>Borrowed by: {copy.borrowed_by.name}</p>
        <button onClick={() => handleReturn(copy.id)}>Return</button>
    </div>
    ))}
    <h3>Available Copies</h3>
    {copies.filter(copy => !copy.is_borrowed).map(copy => (
    <div key={copy.id}>
        <p>Copy ID: {copy.id}</p>
        <select onChange={(e) => handleBorrow(copy.id, e.target.value)}>
        <option value="">Select Client to borrow this copy</option>
        {clients.map(client => (
            <option key={client.id} value={client.id}>
            {client.name}
            </option>
        ))}
        </select>
        {/* <button onClick={() => handleBorrow(copy.id)}>Borrow</button> */}
    </div>
    ))}
    </div>
    </dialog>
    </div>
  );
};

export default CopiesList;