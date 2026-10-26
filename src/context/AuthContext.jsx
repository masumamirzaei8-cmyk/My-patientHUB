import React, { createContext, useContext, useState } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';

const AuthContext = createContext(undefined);

// Read the saved session synchronously so that a page refresh keeps the user
// logged in on the very first render (otherwise ProtectedRoute would bounce
// every refresh to /login and then to /dashboard).
const loadSessionUser = () => {
  const session = getItem('mph_session', null);
  if (!session) return null;
  const accounts = getItem('mph_accounts', []);
  const account = accounts.find(a => a.id === session.userId);
  if (!account) return null;
  return { id: account.id, name: account.name, email: account.email, phone: account.phone, dob: account.dob, address: account.address };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadSessionUser);

  const login = (email, password) => {
    const accounts = getItem('mph_accounts', []);
    const account = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!account) return { success: false, message: 'No account found with this email address' };
    if (account.password !== password) return { success: false, message: 'Incorrect password' };
    const userData = { id: account.id, name: account.name, email: account.email, phone: account.phone, dob: account.dob, address: account.address };
    setUser(userData);
    setItem('mph_session', { userId: account.id });
    return { success: true, message: 'Login successful!' };
  };

  const register = (name, email, password) => {
    const accounts = getItem('mph_accounts', []);
    if (accounts.find(a => a.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists' };
    }
    const newAccount = { id: Date.now().toString(36) + Math.random().toString(36).substr(2), name, email, password };
    accounts.push(newAccount);
    setItem('mph_accounts', accounts);
    return { success: true, message: 'Account created successfully! Please sign in.' };
  };

  const logout = () => {
    setUser(null);
    removeItem('mph_session');
  };

  const updateProfile = (data) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    const accounts = getItem('mph_accounts', []);
    const idx = accounts.findIndex(a => a.id === user.id);
    if (idx >= 0) {
      accounts[idx] = { ...accounts[idx], ...data };
      setItem('mph_accounts', accounts);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
