import { useState } from 'react';
import { X } from 'lucide-react';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        <span className="announcement-tag">NEW</span>
        <p>
          🚀 <strong>FREE SHIPPING</strong> on all orders above ₹500 &nbsp;|&nbsp;
          Easy 30-day returns &nbsp;|&nbsp; 100% Secure Payments
        </p>
      </div>
      <button
        className="announcement-close"
        onClick={() => setVisible(false)}
        aria-label="Close announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
