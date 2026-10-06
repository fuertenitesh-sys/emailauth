import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PlaceholderPage = () => {
  const location = useLocation();
  
  // Create a readable title from the pathname (e.g. /track-order -> Track Order)
  const path = location.pathname.split('/').pop().replace(/-/g, ' ');
  const title = path.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h1>
      <p style={{ color: '#666', maxWidth: '600px', lineHeight: '1.6', fontSize: '1.1rem' }}>
        This page is currently under development. Please check back later for updates regarding our {title.toLowerCase()}.
      </p>
    </div>
  );
};

export default PlaceholderPage;
