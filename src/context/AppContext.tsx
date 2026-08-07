// src/context/AppContext.tsx
import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { Toast, AppContextType } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isElectron] = useState(() => typeof window !== 'undefined' && !!(window as any).electron);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addToast({ type: 'success', message: 'Back online', duration: 3000 });
    };
    const handleOffline = () => {
      setIsOnline(false);
      addToast({ type: 'warning', message: 'You are offline', duration: 0 });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { ...toast, id, duration: toast.duration ?? 5000 };

    setToasts((prev) => [...prev, newToast]);

    if ((newToast.duration ?? 0) > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value: AppContextType = {
    toasts,
    addToast,
    removeToast,
    isOnline,
    isElectron,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
