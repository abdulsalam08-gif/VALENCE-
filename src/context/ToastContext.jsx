import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const VARIANT_STYLES = {
  success: {
    icon: CheckCircle2,
    border: 'border-[#16C784]/35',
    iconColor: 'text-[#16C784]',
    bar: 'bg-[#16C784]',
  },
  error: {
    icon: AlertCircle,
    border: 'border-[#EA3943]/40',
    iconColor: 'text-[#EA3943]',
    bar: 'bg-[#EA3943]',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-[#EA3943]/30',
    iconColor: 'text-[#EA3943]',
    bar: 'bg-[#EA3943]',
  },
  info: {
    icon: Info,
    border: 'border-white/[0.14]',
    iconColor: 'text-[#16C784]',
    bar: 'bg-[#16C784]/70',
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, title, message = '', duration = 4200) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, type, title, message }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const toast = {
    success: (title, message) => push('success', title, message),
    error: (title, message) => push('error', title, message),
    warning: (title, message) => push('warning', title, message),
    info: (title, message) => push('info', title, message),
    dismiss,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed top-20 right-4 z-[90] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2.5"
      >
        {toasts.map((item) => {
          const v = VARIANT_STYLES[item.type] || VARIANT_STYLES.info;
          const Icon = v.icon;
          return (
            <div
              key={item.id}
              role="status"
              className={`pointer-events-auto animate-slide-in relative overflow-hidden rounded-2xl bg-[#141A22]/95 backdrop-blur-xl border ${v.border} p-4 shadow-2xl`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${v.bar}`} />
              <div className="flex items-start gap-3 pl-1">
                <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${v.iconColor}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#F4F6F9]">{item.title}</p>
                  {item.message && (
                    <p className="mt-0.5 text-xs leading-relaxed text-[#9AA4B2]">{item.message}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  aria-label="Dismiss notification"
                  className="rounded-lg p-1 text-[#667085] hover:bg-white/[0.06] hover:text-[#F4F6F9] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
