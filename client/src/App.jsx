import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import API from './services/api';
import ProblemList from './pages/ProblemList';
import AiAssistant from './components/AiAssistant';

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
      <AiAssistant />
    </Router>
  );
}

export default App; // ✅ This line is necessary!
