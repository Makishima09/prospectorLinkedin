import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastType, ToastContainer } from '@/components/common/Toast';

interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 5000) => {
      const id = crypto.randomUUID();
      const newToast: ToastData = { id, type, message, duration };

      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => {
      showToast('success', message, duration);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      showToast('error', message, duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast('warning', message, duration);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      showToast('info', message, duration);
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, success, error, warning, info }}
    >
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }
  return context;
};
