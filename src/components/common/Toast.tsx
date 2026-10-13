import React from 'react';
import { useToastStore, type ToastType } from '../../stores/toast.store';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  const iconMap: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-indigo-500" />,
  };

  const borderMap: Record<ToastType, string> = {
    success: 'border-emerald-200 bg-white/95 text-slate-800 shadow-emerald-50',
    error: 'border-rose-200 bg-white/95 text-slate-800 shadow-rose-50',
    warning: 'border-amber-200 bg-white/95 text-slate-800 shadow-amber-50',
    info: 'border-indigo-200 bg-white/95 text-slate-800 shadow-indigo-50',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-xs transition-all duration-300 animate-slide-up ${borderMap[item.type]}`}
        >
          <div className="flex-shrink-0 mt-0.5">{iconMap[item.type]}</div>
          <div className="flex-1 min-w-0">
            {item.title && (
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                {item.title}
              </h4>
            )}
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">
              {item.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeToast(item.id)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
