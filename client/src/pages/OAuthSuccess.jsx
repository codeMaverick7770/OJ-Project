import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { useToast } from '../context/ToastContext';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showLoader, hideLoader } = useLoading();
  const { showSuccess, showError } = useToast();

  const hasRun = useRef(false); // ✅ Prevent repeat effect

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      showError('No token received. Login failed.');
      navigate('/login');
      return;
    }

    showLoader('Logging you in...');
    try {
      const decoded = jwtDecode(token);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(decoded));
      login(decoded);

      if (decoded?.isNew) showSuccess('Account created successfully!');
      else showSuccess('Login successful!');

      setTimeout(() => {
        hideLoader();
        navigate('/dashboard');
      }, 600);
    } catch (err) {
      console.error('❌ Invalid token:', err);
      showError('Login failed. Please try again.');
      hideLoader();
      navigate('/login');
    }
  }, [login, navigate, showLoader, hideLoader, showSuccess, showError]);

  return null;
};

export default OAuthSuccess;
