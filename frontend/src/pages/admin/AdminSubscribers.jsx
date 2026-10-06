import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Calendar, Users } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';

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
    <div className="admin-page">
      <AdminHeader />
      <div className="admin-content">
        <div className="admin-header-flex">
          <h2><Users size={24} /> Newsletter Subscribers</h2>
          <div className="admin-badge">{subscribers.length} Total</div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="admin-card">
          <div className="table-responsive">
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
                  <tr>
                    <td colSpan="3" className="text-center py-4">Loading subscribers...</td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">No subscribers yet</td>
                  </tr>
                ) : (
                  subscribers.map((sub) => (
                    <tr key={sub._id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-muted" />
                          <span className="fw-500">{sub.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-sm text-muted">
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
                        <span className="status-badge success">Active</span>
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
