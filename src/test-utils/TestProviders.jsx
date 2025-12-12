import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { SavedProvider } from '../context/SavedContext.jsx';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SavedProvider>{children}</SavedProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
