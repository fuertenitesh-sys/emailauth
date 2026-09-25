import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import '../Auth.css'; // Reuse base auth styles
import './Admin.css'; // Premium custom styling

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/admin/login', { username, password });
      if (res.data.success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-bg admin-login-page-bg animate-fade-in">
      <div className="auth-container admin-login-container">
        
        <div className="auth-header">
          <div className="admin-header-icon" style={{ margin: '0 auto 1.5rem', width: '3rem', height: '3rem' }}>
            <ShieldCheck size={32} />
          </div>
          <h2 className="admin-title" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
            Admin Portal
          </h2>
          <p style={{ textAlign: 'center', color: '#64748b' }}>Secure access for authorized personnel only.</p>
        </div>
        
        {error && (
          <div className="auth-alert error" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label" htmlFor="username">Admin ID</label>
            <div className="admin-input-icon-wrapper">
              <User size={18} className="admin-input-icon" />
              <input 
                type="text" 
                id="username" 
                className="input-field admin-input-field" 
                placeholder="Enter admin ID" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <label className="input-label" htmlFor="password">Passcode</label>
            <div className="admin-input-icon-wrapper">
              <Lock size={18} className="admin-input-icon" />
              <input 
                type={showPassword ? "text" : "password"}
                id="password" 
                className="input-field admin-input-field" 
                placeholder="Enter passcode" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.75rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn-full btn-lg mt-4 admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default AdminLogin;
