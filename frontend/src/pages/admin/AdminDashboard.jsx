import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, LogOut, Users, Clock, Mail } from 'lucide-react';
import '../Auth.css'; // Reuse some base styles if needed
import './Admin.css'; // Premium custom styling

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin');
      } else {
        setError('Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/admin/logout');
      navigate('/admin');
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="admin-page-bg">
      <div className="admin-container">
        
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-title-container">
            <div className="admin-header-icon">
              <Shield size={24} />
            </div>
            <h1 className="admin-title">
              Command Center
            </h1>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* Stats Row */}
        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper">
              <Users size={24} />
            </div>
            <div className="admin-stat-info">
              <p>Total Users</p>
              <h3>{users.length}</h3>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-table-container">
          <div className="admin-table-header-title">
            <h2>Registered Users</h2>
          </div>
          
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading intelligence data...</div>
          ) : error ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#f87171' }}>{error}</div>
          ) : users.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No users found.</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user._id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-avatar">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="admin-user-name">{user.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-contact-cell">
                          <Mail size={14} /> {user.email}
                        </div>
                      </td>
                      <td>
                        <div className="admin-date-cell">
                          <Clock size={14} /> {formatDate(user.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
