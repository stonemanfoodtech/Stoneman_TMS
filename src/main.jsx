import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MotionConfig } from 'framer-motion';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: { borderRadius: '14px', fontSize: '14px', fontWeight: 500, color: '#0f172a' },
              success: { iconTheme: { primary: '#015442', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>
);
