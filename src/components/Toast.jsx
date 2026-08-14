import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts = [], onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-center justify-between space-x-3 transition-all ${
            toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' :
            toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' :
            toast.type === 'warning' ? 'bg-amber-950/90 border-amber-500/50 text-amber-200' :
            'bg-slate-900/90 border-slate-700 text-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
            <span className="text-xs font-medium font-sans">{toast.message}</span>
          </div>

          <button
            onClick={() => onRemove(toast.id)}
            aria-label="Close notification"
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
