import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Sparkles } from 'lucide-react';
import './Auth.css'; // Reuse auth styles for consistency

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-container" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <div className="auth-logo">
            <Shield size={48} className="logo-icon-auth" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2>Welcome, {user?.name}!</h2>
          <p>You have successfully authenticated into the secure dashboard.</p>
        </div>
        
        <div style={{ backgroundColor: 'var(--color-bg)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-navy)', fontSize: '1.125rem' }}>Your Profile</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <p className="input-label" style={{ marginBottom: '0.25rem' }}>Full Name</p>
              <p style={{ fontWeight: '500' }}>{user?.name}</p>
            </div>
            <div>
              <p className="input-label" style={{ marginBottom: '0.25rem' }}>Email Address</p>
              <p style={{ fontWeight: '500' }}>{user?.email}</p>
            </div>
          </div>
        </div>

        <button onClick={logout} className="btn btn-outline btn-full btn-lg">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
