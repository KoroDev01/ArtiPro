import { createContext, useContext, useState, useCallback } from "react";
import { FiCheck, FiX, FiAlertCircle, FiInfo } from "react-icons/fi";

const ToastContext = createContext(null);

let toastId = 0;

const ICONS = {
  success: <FiCheck size={16} />,
  error:   <FiAlertCircle size={16} />,
  info:    <FiInfo size={16} />,
};

const STYLES = {
  success: "bg-green-50 border-green-200 text-green-800",
  error:   "bg-red-50 border-red-200 text-red-800",
  info:    "bg-blue-50 border-blue-200 text-blue-800",
};

const DOT = {
  success: "bg-green-500",
  error:   "bg-red-500",
  info:    "bg-blue-500",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  toast.success = (msg, dur) => toast(msg, "success", dur);
  toast.error   = (msg, dur) => toast(msg, "error",   dur);
  toast.info    = (msg, dur) => toast(msg, "info",    dur);

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium max-w-sm w-full pointer-events-auto animate-slide-in ${STYLES[t.type]}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5 ${DOT[t.type]}`}>
              {ICONS[t.type]}
            </span>
            <p className="flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="opacity-50 hover:opacity-100 transition flex-shrink-0 mt-0.5"
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast hors ToastProvider");
  return ctx;
}
