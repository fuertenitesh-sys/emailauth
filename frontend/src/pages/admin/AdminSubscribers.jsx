import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Calendar } from 'lucide-react';
import AdminNav from './AdminNav';
import AdminHeader from '../../components/admin/AdminHeader';
import './Admin.css';

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/subscribers');
      setSubscribers(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-bg">
      <AdminNav />
      <div className="admin-main-wrapper">
        <AdminHeader title="Subscribers Management" />

        <div className="admin-action-bar">
          <h2>Newsletter Subscribers ({subscribers.length})</h2>
        </div>

        {error && <div style={{ color: 'red', padding: '1rem' }}>{error}</div>}

        <div className="admin-table-container">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email Address</th>
                  <th>Subscribed Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#71717a' }}>Loading subscribers...</td></tr>
                ) : subscribers.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>No subscribers yet.</td></tr>
                ) : (
                  subscribers.map((sub) => (
                    <tr key={sub._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                          <Mail size={16} style={{ color: 'var(--color-primary)' }} />
                          <span>{sub.email}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                          <Calendar size={14} />
                          {new Date(sub.subscribedAt || sub.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td>
                        <span className="badge-success" style={{ padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#e6f4ea', color: '#1e8e3e' }}>Active</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscribers;
