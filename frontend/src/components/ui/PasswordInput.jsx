import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './ui.css'; 

const PasswordInput = ({ 
  id, 
  value, 
  onChange, 
  placeholder = "••••••••", 
  required = true, 
  minLength = 6,
  label,
  autoComplete
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="input-group">
      {label && <label className="input-label" htmlFor={id}>{label}</label>}
      <div className="password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={id}
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete || (id === 'confirmPassword' ? 'new-password' : 'current-password')}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="password-toggle-btn"
          aria-label={showPassword === true ? "Hide password" : "Show password"}
        >
          {showPassword === true && <Eye size={20} className="icon-muted" />}
          {showPassword === false && <EyeOff size={20} className="icon-muted" />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
