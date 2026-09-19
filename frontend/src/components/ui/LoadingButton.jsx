import React from 'react';
import './ui.css';

const LoadingButton = ({ 
  children, 
  loading, 
  loadingText = "Please wait...", 
  className = "", 
  disabled, 
  ...props 
}) => {
  return (
    <button 
      className={`btn btn-primary ${className} ${loading ? 'loading-state' : ''}`} 
      disabled={loading || disabled} 
      {...props}
    >
      {loading && (
        <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="spinner-head" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span>{loading ? loadingText : children}</span>
    </button>
  );
};

export default LoadingButton;
