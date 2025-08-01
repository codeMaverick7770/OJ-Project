import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LoadingProvider } from './context/LoadingContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import './index.css';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}> 
      <AuthProvider>
        <LoadingProvider>       
          <App />
        </LoadingProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
