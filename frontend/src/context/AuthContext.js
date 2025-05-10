
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Example: Check if user is authenticated (e.g., via token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Simulate fetching user data
      setUser({ id: '123', username: 'example' }); // Replace with actual user data
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('authToken', 'your-token'); // Store token
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};