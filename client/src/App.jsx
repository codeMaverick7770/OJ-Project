import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import API from './services/api';
import { Toaster } from 'react-hot-toast';
import GlobalLoader from './components/GlobalLoader';
import { ToastProvider } from './context/ToastContext';
import { useLoading } from './context/LoadingContext'; // ✅ added

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true); // renamed for clarity
  const { loading, message } = useLoading(); 
  useEffect(() => {
    const minDelay = new Promise(resolve => setTimeout(resolve, 400));
    const pingServer = API.get('/ping');

    Promise.all([minDelay, pingServer])
      .catch(err => console.error('❌ FE-BE connection failed', err))
      .finally(() => setIsAppLoading(false));
  }, []);

  // Loader during initial app boot
  if (isAppLoading) return <GlobalLoader message="Initializing app..." />;

  return (
    <ToastProvider>
      <Router>
        {/* ✅ Global loading context loader */}
        {loading && <GlobalLoader message={message} />}

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
    </ToastProvider>
  );
}

export default App;
