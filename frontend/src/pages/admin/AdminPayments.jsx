import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, IndianRupee, Search, Shield, RefreshCw } from 'lucide-react';
import AdminNav from './AdminNav';
import AdminHeader from '../../components/admin/AdminHeader';
import { adminCache, setAdminCache } from '../../utils/adminCache';
import './Admin.css';

const AdminPayments = () => {
  const [payments, setPayments] = useState(adminCache.payments || []);
  const [loading, setLoading] = useState(!adminCache.payments);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPayments = async (force = false) => {
    try {
      if (force || !adminCache.payments) setLoading(true);
      const res = await axios.get('/api/admin/payments');
      setAdminCache('payments', res.data);
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(p => 
    p._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.paymentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page-bg">
      <AdminNav />
      <div className="admin-main-wrapper">
        <AdminHeader title="Payments Management" />
        
        <div className="admin-action-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="admin-search-box">
            <Search size={18} className="admin-search-icon" />
            <input 
              type="text" 
              placeholder="Search by Payment or Order ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>
          <button onClick={() => fetchPayments(true)} className="btn btn-outline btn-sm">
            <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>

        <div className="admin-table-container">
          <div className="admin-table-wrapper">
            {loading ? (
              <div className="admin-loading-state">
                <div className="spinner"></div>
                <p>Loading payments...</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                          <Shield size={32} style={{ color: 'var(--color-border)' }} />
                          <p>No payments found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map(payment => (
                      <tr key={payment._id}>
                        <td>
                          <span style={{ fontFamily: 'monospace', color: 'var(--color-primary)' }}>
                            {payment.paymentId || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                            {payment.orderId}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <IndianRupee size={14} />{payment.amount?.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CreditCard size={15} style={{ color: 'var(--color-text-muted)' }} />
                            <span>{payment.paymentMethod || 'Online'}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`admin-status-badge ${payment.status === 'successful' ? 'admin-status-active' : 'admin-status-inactive'}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                          {new Date(payment.createdAt).toLocaleDateString()} {new Date(payment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
