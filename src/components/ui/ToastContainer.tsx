import React from 'react';
import { useStore } from '../../store';
import { X, CheckCircle, Info, AlertCircle, AlertTriangle } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-4 left-4 z-[100] flex flex-col gap-2">
      {toasts.map(toast => {
        let Icon = Info;
        let colorClass = 'bg-blue-50 text-blue-800 border-blue-200';
        
        if (toast.type === 'success') {
          Icon = CheckCircle;
          colorClass = 'bg-green-50 text-green-800 border-green-200';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClass = 'bg-yellow-50 text-yellow-800 border-yellow-200';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClass = 'bg-red-50 text-red-800 border-red-200';
        }

        return (
          <div key={toast.id} className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-sm transition-all duration-300 animate-in slide-in-from-bottom-5 ${colorClass}`}>
            <Icon className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-slate-500 hover:text-slate-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
