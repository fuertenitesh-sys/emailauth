import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Package, LogOut, ChevronRight, Shield, Mail, Edit3 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(null);

  useEffect(() => {
    import('axios').then(({ default: axios }) => {
      axios.get('/api/orders/my')
        .then(res => setOrderCount(res.data.length))
        .catch(() => setOrderCount(0));
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="profile-page">
      <div className="container profile-container">

        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{initials}</span>
          </div>
          <div className="profile-header-info">
            <h1>{user?.name}</h1>
            <p className="profile-email">
              <Mail size={14} />
              {user?.email}
            </p>
            {user?.role === 'admin' && (
              <span className="profile-admin-badge">
                <Shield size={12} /> Admin
              </span>
            )}
          </div>
        </div>

        <div className="profile-grid">
          {/* Info Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>Account Details</h3>
            </div>
            <div className="profile-field">
              <label>Full Name</label>
              <p>{user?.name}</p>
            </div>
            <div className="profile-field">
              <label>Email Address</label>
              <p>{user?.email}</p>
            </div>
            <div className="profile-field">
              <label>Account Type</label>
              <p style={{ textTransform: 'capitalize' }}>{user?.role || 'Customer'}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="profile-links-section">
            <Link to="/orders" className="profile-quick-link">
              <div className="profile-quick-link-icon">
                <Package size={20} />
              </div>
              <div className="profile-quick-link-text">
                <span>My Orders</span>
                <small>{orderCount === null ? '...' : `${orderCount} order${orderCount !== 1 ? 's' : ''}`}</small>
              </div>
              <ChevronRight size={18} className="profile-quick-link-arrow" />
            </Link>

            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="profile-quick-link">
                <div className="profile-quick-link-icon admin">
                  <Shield size={20} />
                </div>
                <div className="profile-quick-link-text">
                  <span>Admin Panel</span>
                  <small>Manage store</small>
                </div>
                <ChevronRight size={18} className="profile-quick-link-arrow" />
              </Link>
            )}

            <button className="profile-quick-link logout-link" onClick={handleLogout}>
              <div className="profile-quick-link-icon danger">
                <LogOut size={20} />
              </div>
              <div className="profile-quick-link-text">
                <span>Sign Out</span>
                <small>Log out of your account</small>
              </div>
              <ChevronRight size={18} className="profile-quick-link-arrow" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
