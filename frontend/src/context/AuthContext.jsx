import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('qb_token') || null);
  const [customer, setCustomer] = useState(
    localStorage.getItem('qb_customer') ? JSON.parse(localStorage.getItem('qb_customer')) : null
  );

  const login = (userData, authToken) => {
    setCustomer(userData);
    setToken(authToken);
    localStorage.setItem('qb_token', authToken);
    localStorage.setItem('qb_customer', JSON.stringify(userData));
  };

  const logout = () => {
    setCustomer(null);
    setToken(null);
    localStorage.removeItem('qb_token');
    localStorage.removeItem('qb_customer');
  };

  return (
    <AuthContext.Provider value={{ customer, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
