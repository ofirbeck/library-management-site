import React, { createContext, useState, useEffect, useContext } from 'react';

export const ClientsContext = createContext();

export const useClients = () => {
    return useContext(ClientsContext);
};

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/clients/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  return (
    <ClientsContext.Provider value={{ clients, fetchClients }}>
      {children}
    </ClientsContext.Provider>
  );
};

