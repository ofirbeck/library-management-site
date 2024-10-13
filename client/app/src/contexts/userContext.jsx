import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [libraryName, setLibraryName] = useState("");
  return (
    <UserContext.Provider value={{user, setUser, username, setUsername, libraryName, setLibraryName}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);