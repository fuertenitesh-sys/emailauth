import React, { useEffect, useState } from 'react';
import './InfoPages.css';

const ContactPage = () => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      e.target.reset();
    }, 1500);
  };

  return (
    <div className="info-page-container">
      <div className="info-content-wrapper">
        <h1 className="info-title">Contact Us</h1>
        <p className="info-subtitle">
          Have a question or need assistance? Fill out the form below and our team will get back to you within 24 hours.
        </p>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid #333', borderRadius: '4px' }}>
            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Thank You!</h2>
            <p style={{ color: '#a1a1aa' }}>Your message has been successfully sent. We will contact you shortly.</p>
            <button className="info-submit-btn" onClick={() => setStatus('')}>Send Another Message</button>
          </div>
        ) : (
          <form className="info-form" onSubmit={handleSubmit}>
            <div className="info-form-group">
              <label>Name</label>
              <input type="text" required className="info-input" placeholder="Enter your full name" />
            </div>
            <div className="info-form-group">
              <label>Email Address</label>
              <input type="email" required className="info-input" placeholder="Enter your email address" />
            </div>
            <div className="info-form-group">
              <label>Subject</label>
              <input type="text" required className="info-input" placeholder="What is this regarding?" />
            </div>
            <div className="info-form-group">
              <label>Message</label>
              <textarea required className="info-textarea" placeholder="How can we help you today?"></textarea>
            </div>
            <button type="submit" className="info-submit-btn" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
