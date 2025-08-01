// src/context/ToastContext.jsx
import { createContext, useContext } from 'react';
import { toast } from 'react-hot-toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showSuccess = (msg) => toast.success(msg);
  const showError = (msg) => toast.error(msg);
  const showMessage = (msg) => toast(msg);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showMessage }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
