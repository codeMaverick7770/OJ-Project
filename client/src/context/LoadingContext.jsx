import React, { createContext, useContext, useState, useCallback } from 'react';

// Create Context
const LoadingContext = createContext();

// Provider component
export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Show loader with optional message
  const showLoader = useCallback((msg = '') => {
    setMessage(msg);
    setLoading(true);
  }, []);

  // Hide loader
  const hideLoader = useCallback(() => {
    setLoading(false);
    setMessage('');
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, message, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
}

// Custom hook for easy access
export function useLoading() {
  return useContext(LoadingContext);
}
