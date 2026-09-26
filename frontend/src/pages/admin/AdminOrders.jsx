import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, LogOut, ChevronDown } from 'lucide-react';
import './Admin.css';
import AdminNav from './AdminNav';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors = { pending: 'badge-warning', processing: 'badge-primary', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger' };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/admin/orders');
      setOrders(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin');
    } finally { setLoading(false); }
  };

  const handleLogout = async () => { try { await axios.post('/api/admin/logout'); } catch {} navigate('/admin'); };

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const res = await axios.put(`/api/admin/orders/${orderId}/status`, { orderStatus: status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: res.data.orderStatus } : o));
    } catch (err) { alert('Failed to update status'); }
    finally { setUpdatingId(null); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="admin-page-bg">
      <div className="admin-container">
        <header className="admin-header">
          <div className="admin-header-title-container">
            <div className="admin-header-icon"><Shield size={24} /></div>
            <h1 className="admin-title">Admin Panel</h1>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn"><LogOut size={16} /> Logout</button>
        </header>

        <AdminNav />

        <div className="admin-action-bar">
          <h2>Orders ({orders.length})</h2>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}><div className="loading-spinner" style={{ margin: '0 auto' }} /></div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No orders yet.</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Details</th></tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <>
                      <tr key={order._id}>
                        <td style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--color-primary)' }}>#{order._id.slice(-8).toUpperCase()}</td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{order.user?.name || 'N/A'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{order.user?.email}</div>
                        </td>
                        <td style={{ color: 'var(--color-text-muted)' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                        <td style={{ fontWeight: 700 }}>₹{order.totalAmount.toFixed(2)}</td>
                        <td>
                          <select
                            className="order-status-select"
                            value={order.orderStatus}
                            onChange={e => handleStatusChange(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                          >
                            {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{formatDate(order.createdAt)}</td>
                        <td>
                          <button
                            className="admin-table-action-btn edit"
                            onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                            style={{ gap: '0.25rem', display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}
                          >
                            <ChevronDown size={14} style={{ transform: expanded === order._id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                          </button>
                        </td>
                      </tr>
                      {expanded === order._id && (
                        <tr key={`${order._id}-detail`}>
                          <td colSpan="7" style={{ padding: '0', background: 'var(--color-bg)' }}>
                            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                  <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Order Items</p>
                                  {order.items.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border)' }}>
                                      <span>{item.name} × {item.quantity}</span>
                                      <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Shipping Address</p>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                                    {order.shippingAddress?.fullName}<br/>
                                    {order.shippingAddress?.address}<br/>
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br/>
                                    {order.shippingAddress?.phone}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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

export default AdminOrders;
