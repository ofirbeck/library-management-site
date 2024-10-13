import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState("");
  return (
    <UIContext.Provider value={{ currentScreen, setCurrentScreen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);