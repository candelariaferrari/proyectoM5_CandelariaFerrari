import { createContext, useCallback, useMemo, useRef, useState } from "react";

export type ToastTone = "ok" | "danger";

interface ToastState {
  message: string;
  tone: ToastTone;
}

interface ToastContextType {
  toast: ToastState | null;
  showToast: (message: string, tone?: ToastTone) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Mismo tiempo suficiente para leerlo sin sentirse lento.
const TOAST_DURATION_MS = 2600;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, tone: ToastTone = "ok") => {
    // Si ya había un toast mostrándose, reiniciamos el timer 
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ message, tone });
    timeoutRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  const value = useMemo(() => ({ toast, showToast }), [toast, showToast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
