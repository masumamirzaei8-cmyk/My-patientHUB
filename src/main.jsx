import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'white',
          color: '#344054',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          borderRadius: '0.75rem',
          padding: '1rem 1.5rem',
        },
        success: {
          iconTheme: {
            primary: '#22A06B',
            secondary: 'white',
          },
        },
        error: {
          iconTheme: {
            primary: '#E5484D',
            secondary: 'white',
          },
        },
      }}
    />
  </React.StrictMode>
);
