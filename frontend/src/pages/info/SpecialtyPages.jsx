import React, { useEffect, useState } from 'react';
import './InfoPages.css';

export const GiftCardsPage = () => {
  const [amount, setAmount] = useState('50');

  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="info-page-container">
      <div className="info-content-wrapper" style={{ textAlign: 'center' }}>
        <h1 className="info-title">LUMEN E-Gift Card</h1>
        <p className="info-subtitle">Give the gift of choice. Delivered instantly via email.</p>
        
        <div style={{ border: '1px solid #333', padding: '3rem', borderRadius: '8px', maxWidth: '500px', margin: '0 auto', background: '#0a0a0a' }}>
          <div style={{ background: '#fff', color: '#000', padding: '3rem', borderRadius: '8px', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '0.2em' }}>
            LUMEN
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {['25', '50', '100', '200'].map(val => (
              <button 
                key={val}
                onClick={() => setAmount(val)}
                style={{ 
                  background: amount === val ? '#fff' : 'transparent', 
                  color: amount === val ? '#000' : '#fff',
                  border: '1px solid #fff',
                  padding: '0.5rem 1.5rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ${val}
              </button>
            ))}
          </div>
          <button className="info-submit-btn" style={{ width: '100%' }}>Add to Cart - ${amount}</button>
        </div>
      </div>
    </div>
  );
};

export const StudentDiscountPage = () => {
  const [status, setStatus] = useState('');

  useEffect(() => window.scrollTo(0, 0), []);

  const handleVerify = (e) => {
    e.preventDefault();
    setStatus('verifying');
    setTimeout(() => setStatus('verified'), 2000);
  };

  return (
    <div className="info-page-container">
      <div className="info-content-wrapper">
        <h1 className="info-title">Student Discount</h1>
        <p className="info-subtitle">Register your student status to unlock an exclusive 20% discount on all full-priced items.</p>
        
        {status === 'verified' ? (
           <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid #333', borderRadius: '4px' }}>
            <h2 style={{ color: '#4ade80', marginBottom: '1rem' }}>Success!</h2>
            <p style={{ color: '#a1a1aa' }}>Your student email has been verified. Use code <strong>STUDENT20</strong> at checkout.</p>
           </div>
        ) : (
          <form className="info-form" onSubmit={handleVerify}>
            <div className="info-form-group">
              <label>University / College Email</label>
              <input type="email" required className="info-input" placeholder="e.g. name@university.edu" />
            </div>
            <button type="submit" className="info-submit-btn" disabled={status === 'verifying'}>
              {status === 'verifying' ? 'Verifying...' : 'Verify Status'}
            </button>
            <p style={{ fontSize: '0.75rem', color: '#71717a', textAlign: 'center', marginTop: '1rem' }}>
              By verifying, you agree to our Student Discount Terms & Conditions.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export const PaymentMethodsPage = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="info-page-container">
      <div className="info-content-wrapper">
        <h1 className="info-title">Payment Methods</h1>
        <p className="info-subtitle">We offer secure payment options for a seamless checkout experience.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ border: '1px solid #333', padding: '2rem', borderRadius: '4px' }}>
            <h3 style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="pay-badge" style={{ background: '#fff', color: '#000', padding: '0.2rem 0.5rem', borderRadius: '2px', fontSize: '0.8rem', fontWeight: 'bold' }}>CARDS</span>
              Credit & Debit Cards
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.5' }}>We accept Visa, Mastercard, American Express, and Discover cards globally. All transactions are securely encrypted.</p>
          </div>
          
          <div style={{ border: '1px solid #333', padding: '2rem', borderRadius: '4px' }}>
            <h3 style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="pay-badge" style={{ background: '#003087', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '2px', fontSize: '0.8rem', fontWeight: 'bold' }}>PayPal</span>
              PayPal
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.5' }}>Check out quickly and securely with your PayPal account. You can also use PayPal Pay in 4 for eligible orders.</p>
          </div>

          <div style={{ border: '1px solid #333', padding: '2rem', borderRadius: '4px' }}>
            <h3 style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="pay-badge" style={{ background: '#ffb3c7', color: '#000', padding: '0.2rem 0.5rem', borderRadius: '2px', fontSize: '0.8rem', fontWeight: 'bold' }}>Klarna</span>
              Buy Now, Pay Later
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.5' }}>Split your purchase into 4 interest-free payments or pay in 30 days with Klarna. Subject to approval.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
