import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'warning' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  return (
    <div className={`toast ${message ? 'show' : ''}`} role="alert" aria-live="polite">
      {type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#20C9C3] shrink-0" />}
      {type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
      {type === 'info' && <Info className="w-5 h-5 text-[#B8F3F0] shrink-0" />}
      <span>{message}</span>
    </div>
  );
};
