'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: {
      bg: 'bg-white',
      border: 'border-green-500',
      text: 'text-green-700',
      icon: '✓',
      iconBg: 'bg-green-500'
    },
    error: {
      bg: 'bg-white',
      border: 'border-red-500',
      text: 'text-red-700',
      icon: '✕',
      iconBg: 'bg-red-500'
    },
    warning: {
      bg: 'bg-white',
      border: 'border-yellow-500',
      text: 'text-yellow-700',
      icon: '⚠',
      iconBg: 'bg-yellow-500'
    },
    info: {
      bg: 'bg-white',
      border: 'border-blue-500',
      text: 'text-blue-700',
      icon: 'ℹ',
      iconBg: 'bg-blue-500'
    }
  };

  const style = styles[type];

  return (
    <div
      className={`transform transition-all duration-300 ${
        isExiting ? '-translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className={`${style.bg} border-l-4 ${style.border} rounded-r-lg shadow-lg px-4 py-3 flex items-center space-x-3 min-w-[300px] max-w-md backdrop-blur-sm`}>
        <div className={`${style.iconBg} w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0`}>
          {style.icon}
        </div>
        <p className={`${style.text} text-sm font-medium flex-1`}>{message}</p>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsVisible(false);
              onClose();
            }, 300);
          }}
          className={`${style.text} hover:opacity-70 transition flex-shrink-0`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Toast 管理器
interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map(toast => (
          <div key={toast.id} className="mb-2">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return { showToast, ToastContainer };
}