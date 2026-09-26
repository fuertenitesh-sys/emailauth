import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />,
  error: <AlertCircle size={18} style={{ color: 'var(--color-danger)' }} />,
  warning: <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />,
  info: <Info size={18} style={{ color: 'var(--color-primary)' }} />,
};

const Toast = ({ toast, onClose }) => (
  <div className={`toast toast-${toast.type}`}>
    {icons[toast.type]}
    <p className="toast-message">{toast.message}</p>
    <button className="toast-close" onClick={onClose}><X size={14} /></button>
  </div>
);

export default Toast;
