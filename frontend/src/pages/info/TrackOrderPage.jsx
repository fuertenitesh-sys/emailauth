import React, { useEffect, useState } from 'react';
import './InfoPages.css';

const TrackOrderPage = () => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    setStatus('tracking');
    setTimeout(() => {
      setStatus('tracked');
    }, 1500);
  };

  return (
    <div className="info-page-container">
      <div className="info-content-wrapper">
        <h1 className="info-title">Track My Order</h1>
        <p className="info-subtitle">
          Enter your order number and email address below to check the current status of your shipment.
        </p>

        {status === 'tracked' ? (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid #333', borderRadius: '4px' }}>
            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Order Status: <span style={{ color: '#4ade80' }}>Shipped</span></h2>
            <p style={{ color: '#a1a1aa', marginBottom: '0.5rem' }}>Your order is currently in transit with our delivery partners.</p>
            <p style={{ color: '#d4d4d8', marginBottom: '2rem' }}>Estimated Delivery: <strong>Within 2-3 Business Days</strong></p>
            <button className="info-submit-btn" onClick={() => setStatus('')}>Track Another Order</button>
          </div>
        ) : (
          <form className="info-form" onSubmit={handleTrack}>
            <div className="info-form-group">
              <label>Order Number</label>
              <input type="text" required className="info-input" placeholder="e.g. LUM-123456789" />
            </div>
            <div className="info-form-group">
              <label>Email Address</label>
              <input type="email" required className="info-input" placeholder="Email used during checkout" />
            </div>
            <button type="submit" className="info-submit-btn" disabled={status === 'tracking'}>
              {status === 'tracking' ? 'Locating...' : 'Track Order'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
