import type { ReactNode } from 'react';
// eslint-disable-next-line no-duplicate-imports
import React, { createContext, useContext } from 'react';
import Toast from 'react-native-toast-message';

/* ================= TYPES ================= */
type ToastParams = {
  title: string;
  message: string;
};

type ToastContextType = {
  showToast: (params: ToastParams) => void;
};

/* ================= CONTEXT ================= */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/* ================= PROVIDER ================= */
type Props = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: Props) => {
  const showToast = ({ title, message }: ToastParams) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
};

/* ================= HOOK ================= */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};
