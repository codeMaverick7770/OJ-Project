import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import API from './services/api';
import { Toaster } from 'react-hot-toast';
import GlobalLoader from './components/GlobalLoader'; // ✅ Import your loader

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minDelay = new Promise(resolve => setTimeout(resolve, 400)); // 400ms minimum
    const pingServer = API.get('/ping');

    Promise.all([minDelay, pingServer])
      .catch(err => console.error('❌ FE-BE connection failed', err))
      .finally(() => setIsLoading(false)); // both must finish
  }, []);

  if (isLoading) return <GlobalLoader />; // ✅ Show loader until done

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
