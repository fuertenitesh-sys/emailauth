import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './InfoPages.css';

const TrackOrderPage = () => {
  const [status, setStatus] = useState('');
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTrack = async (e) => {
    e.preventDefault();
    setStatus('tracking');
    setErrorMsg('');
    
    try {
      const res = await axios.post('/api/orders/track', { orderNumber: orderId, email });
      setOrderData(res.data);
      setStatus('tracked');
    } catch (err) {
      setStatus('');
      setErrorMsg(err.response?.data?.message || 'Failed to track order. Please check your details.');
    }
  };

  const getStatusColor = (s) => {
    switch(s) {
      case 'delivered': return '#4ade80';
      case 'shipped': return '#60a5fa';
      case 'processing': return '#fbbf24';
      case 'cancelled': return '#f87171';
      default: return '#fbbf24';
    }
  };

  return (
    <div className="info-page-container">
      <div className="info-content-wrapper">
        <h1 className="info-title">Track My Order</h1>
        <p className="info-subtitle">
          Enter your order number and email address below to check the current status of your shipment.
        </p>

        {status === 'tracked' && orderData ? (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid #333', borderRadius: '4px' }}>
            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>
              Order Status: <span style={{ color: getStatusColor(orderData.orderStatus), textTransform: 'capitalize' }}>{orderData.orderStatus}</span>
            </h2>
            <div style={{ background: '#111', padding: '1.5rem', borderRadius: '4px', textAlign: 'left', marginBottom: '2rem', display: 'inline-block' }}>
              <p style={{ color: '#d4d4d8', marginBottom: '0.5rem' }}><strong>Order ID:</strong> #{orderData.shortId}</p>
              <p style={{ color: '#d4d4d8', marginBottom: '0.5rem' }}><strong>Date:</strong> {new Date(orderData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <p style={{ color: '#d4d4d8', marginBottom: '0.5rem' }}><strong>Items:</strong> {orderData.itemsCount}</p>
              <p style={{ color: '#d4d4d8', marginBottom: '0' }}><strong>Total:</strong> ₹{orderData.totalAmount.toFixed(2)}</p>
            </div>
            <br />
            <button className="info-submit-btn" onClick={() => { setStatus(''); setOrderData(null); }}>Track Another Order</button>
          </div>
        ) : (
          <form className="info-form" onSubmit={handleTrack}>
            {errorMsg && <div style={{ background: '#450a0a', color: '#fca5a5', padding: '1rem', borderRadius: '4px', textAlign: 'center', fontSize: '0.9rem' }}>{errorMsg}</div>}
            <div className="info-form-group">
              <label>Order Number</label>
              <input 
                type="text" 
                required 
                className="info-input" 
                placeholder="e.g. 8A7C760D or #8A7C760D" 
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
              />
            </div>
            <div className="info-form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                className="info-input" 
                placeholder="Email used during checkout" 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
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
