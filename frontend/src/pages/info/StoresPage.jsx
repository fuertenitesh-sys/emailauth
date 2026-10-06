import React, { useEffect } from 'react';
import './InfoPages.css';

const StoresPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stores = [
    {
      city: 'London Flagship',
      address: '15 Oxford Street, London W1D 2BQ',
      hours: 'Mon-Sat: 10am - 8pm | Sun: 12pm - 6pm',
      phone: '+44 20 7123 4567'
    },
    {
      city: 'New York',
      address: '125 5th Avenue, New York, NY 10003',
      hours: 'Mon-Sat: 10am - 9pm | Sun: 11am - 7pm',
      phone: '+1 212-555-0199'
    },
    {
      city: 'Mumbai',
      address: 'Palladium Mall, Lower Parel, Mumbai 400013',
      hours: 'Mon-Sun: 11am - 10pm',
      phone: '+91 22 6666 7777'
    },
    {
      city: 'Tokyo',
      address: '1-chōme-14-5 Jingūmae, Shibuya City, Tokyo',
      hours: 'Mon-Sun: 11am - 8pm',
      phone: '+81 3-5555-0199'
    }
  ];

  return (
    <div className="info-page-container">
      <div className="info-content-wrapper" style={{ maxWidth: '1000px' }}>
        <h1 className="info-title">Our Stores</h1>
        <p className="info-subtitle">
          Visit a LUMEN location near you to experience our premium collections in person.
        </p>

        <div className="stores-grid">
          {stores.map((store, index) => (
            <div key={index} className="store-card">
              <h3>{store.city}</h3>
              <p style={{ color: '#ffffff', marginBottom: '1rem' }}>{store.address}</p>
              <p><strong>Hours:</strong> {store.hours}</p>
              <p><strong>Phone:</strong> {store.phone}</p>
              <button style={{ marginTop: '1.5rem', background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '0.5rem 1rem', cursor: 'pointer' }}>Get Directions</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoresPage;
