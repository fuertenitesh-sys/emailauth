import React from 'react';
import './ui.css';

const PasswordStrength = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'transparent' };

    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score, label: 'Medium', color: '#f59e0b' };
    return { score, label: 'Strong', color: '#10b981' };
  };

  const { score, label, color } = getStrength(password);

  if (!password) return null;

  return (
    <div className="password-strength-container">
      <div className="strength-bars">
        <div className={`strength-bar ${score >= 1 ? 'active' : ''}`} style={{ backgroundColor: score >= 1 ? color : '' }}></div>
        <div className={`strength-bar ${score >= 3 ? 'active' : ''}`} style={{ backgroundColor: score >= 3 ? color : '' }}></div>
        <div className={`strength-bar ${score >= 5 ? 'active' : ''}`} style={{ backgroundColor: score >= 5 ? color : '' }}></div>
      </div>
      <span className="strength-label" style={{ color }}>{label}</span>
    </div>
  );
};

export default PasswordStrength;
