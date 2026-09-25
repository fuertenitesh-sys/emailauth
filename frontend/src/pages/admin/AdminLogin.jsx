import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User } from 'lucide-react';
import axios from 'axios';
import '../Auth.css'; // Reuse base auth styles

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    <div className="auth-page animate-fade-in" style={{ background: 'radial-gradient(circle at top right, #1a0b2e 0%, #000000 100%)' }}>
      <div className="auth-container" style={{ borderColor: 'rgba(139, 92, 246, 0.3)', boxShadow: '0 0 40px rgba(139, 92, 246, 0.1)' }}>
        
        <div className="auth-header">
          <div className="auth-logo" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
            <ShieldCheck size={32} className="logo-icon-auth" style={{ color: '#8b5cf6' }} />
          </div>
          <h2 style={{ background: 'linear-gradient(to right, #c4b5fd, #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Admin Portal
          </h2>
          <p>Secure access for authorized personnel only.</p>
        </div>
        
        {error && (
          <div className="auth-alert error" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label" htmlFor="username">Admin ID</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                id="username" 
                className="input-field" 
                style={{ paddingLeft: '2.5rem', borderColor: 'rgba(139, 92, 246, 0.3)' }}
                placeholder="Enter admin ID" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <label className="input-label" htmlFor="password">Passcode</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="password" 
                id="password" 
                className="input-field" 
                style={{ paddingLeft: '2.5rem', borderColor: 'rgba(139, 92, 246, 0.3)' }}
                placeholder="Enter passcode" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn-full btn-lg mt-4 flex justify-center items-center gap-2"
            disabled={loading}
            style={{ background: 'linear-gradient(to right, #7c3aed, #6d28d9)' }}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default AdminLogin;
