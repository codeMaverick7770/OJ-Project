import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import API from './services/api';
import { Toaster } from 'react-hot-toast';

function App() {
  useEffect(() => {
    API.get('/ping')
      .then(res => console.log(res.data))
      .catch(err => console.error('❌ FE-BE connection failed', err));
  }, []);

  return (
    <Router>
      <Navbar />
      <AppRoutes />
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f1f1f',
            color: '#fff',
            border: '1px solid #3b3b3b',
          },
        }}
      />
    </Router>
  );
}

export default App;
