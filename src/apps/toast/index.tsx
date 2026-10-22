import { useEffect, useRef, useState, createContext, useContext } from 'react';
import './toast.css';

type toastType = 'success' | 'error' | 'info';
type toastProps = {
  message?: string;
  type?: toastType;
  timer?: number;
  onClose?: () => void;
};
type ToastItem = {
  id: number;
  message: string;
  type?: toastType;
  timer?: number;
};
type ToastContextValue = {
  addToast: (toast: ToastItem) => void;
  removeToast: (id: number) => void;
};

const MAX_VISIBLE = 3;

const ToastContext = createContext<ToastContextValue | null>(null);

const Toast = ({
  message = '',
  type = 'success',
  timer = 2000,
  onClose,
}: toastProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const startTime = useRef(Date.now());
  const timeLeft = useRef(timer);
  // hover and focus can both pause; resume only when neither is active
  const pausedBy = useRef(0);

  useEffect(() => {
    // timer 0 = sticky toast, never auto-dismiss
    if (isPaused || timer === 0) return;
    startTime.current = Date.now();
    const time = setTimeout(() => {
      onClose?.();
    }, timeLeft.current);

    return () => clearTimeout(time);
  }, [isPaused]);

  const pause = () => {
    if (pausedBy.current === 0) {
      timeLeft.current = timeLeft.current - (Date.now() - startTime.current);
      setIsPaused(true);
    }
    pausedBy.current += 1;
  };

  const resume = () => {
    pausedBy.current = Math.max(0, pausedBy.current - 1);
    if (pausedBy.current === 0) setIsPaused(false);
  };

  return (
    <div
      className={`toast ${type}`}
      role={type === 'error' ? 'alert' : undefined}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
};

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (toast: ToastItem) => {
    setToasts((prev) => [...prev, { timer: 3000, ...toast }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Escape dismisses the newest visible toast
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setToasts((prev) => {
        const visible = prev.slice(0, MAX_VISIBLE);
        const newest = visible[visible.length - 1];
        return newest ? prev.filter((toast) => toast.id !== newest.id) : prev;
      });
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.slice(0, MAX_VISIBLE).map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            timer={toast.timer}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider');
  }
  return context;
};

const ToastButtons = () => {
  const { addToast, removeToast } = useToast();

  return (
    <>
      <button
        onClick={() => {
          const id = Date.now();
          addToast({ id, message: `I am toast ${id}`, type: 'success' });
        }}
      >
        add toasts
      </button>
      <button
        onClick={() => {
          const id = Date.now();
          addToast({ id, message: `I am an error ${id}`, type: 'error' });
        }}
      >
        add toasts error
      </button>
    </>
  );
};

export default function ToastApp() {
  return (
    <div>
      <button type="button" onClick={() => console.log('button clicked')}>
        button
      </button>
      <div onClick={() => console.log('div clicked')}>divbutton</div>
    </div>
    // <ToastProvider>
    //   <ToastButtons />
    // </ToastProvider>
  );
}
