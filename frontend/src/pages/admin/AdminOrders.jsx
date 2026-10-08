import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Shield, LogOut, ChevronDown } from 'lucide-react';
import './Admin.css';
import AdminNav from './AdminNav';
import AdminHeader from '../../components/admin/AdminHeader';
import { adminCache, setAdminCache } from '../../utils/adminCache';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const getStatusStyle = (status) => {
  switch(status) {
    case 'delivered': return { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'rgb(16, 185, 129)', fontWeight: 600, border: 'none', padding: '4px 8px', borderRadius: '4px' };
    case 'cancelled': return { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', fontWeight: 600, border: 'none', padding: '4px 8px', borderRadius: '4px' };
    case 'pending': return { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'rgb(245, 158, 11)', fontWeight: 600, border: 'none', padding: '4px 8px', borderRadius: '4px' };
    default: return { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', fontWeight: 600, border: 'none', padding: '4px 8px', borderRadius: '4px' };
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState(adminCache.orders || []);
  const [loading, setLoading] = useState(!adminCache.orders);
  const [payments, setPayments] = useState(adminCache.payments || []);
  const [updatingId, setUpdatingId] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const filterStatus = new URLSearchParams(location.search).get('status') || 'all';

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.orderStatus === filterStatus);

  useEffect(() => { 
    fetchOrders(); 
    fetchPayments();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/admin/orders');
      setAdminCache('orders', res.data);
      setOrders(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin');
    } finally { setLoading(false); }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/api/admin/payments');
      setAdminCache('payments', res.data);
      setPayments(res.data);
    } catch (err) {}
  };


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
      <AdminNav />
      <div className="admin-main-wrapper">
        <AdminHeader title="Orders Management" />

        <div className="admin-action-bar">
          <h2>{filterStatus === 'all' ? 'All Orders' : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Orders`} ({filteredOrders.length})</h2>
          
          <select 
            value={filterStatus} 
            onChange={(e) => {
              setCurrentPage(1);
              navigate(e.target.value === 'all' ? '/admin/orders' : `/admin/orders?status=${e.target.value}`);
            }}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', fontWeight: 600 }}
          >
            <option value="all">All Status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        <div className="admin-table-container">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Details</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="skeleton-row">
                      <td><div className="skeleton-cell medium"></div></td>
                      <td><div className="skeleton-cell long"></div></td>
                      <td><div className="skeleton-cell short"></div></td>
                      <td><div className="skeleton-cell short"></div></td>
                      <td><div className="skeleton-cell short"></div></td>
                      <td><div className="skeleton-cell medium"></div></td>
                      <td><div className="skeleton-cell short"></div></td>
                    </tr>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>No orders found for this status.</td></tr>
                ) : (
                  filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(order => (
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
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem', 
                            fontWeight: 600,
                            backgroundColor: order.paymentStatus === 'paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: order.paymentStatus === 'paid' ? 'rgb(16, 185, 129)' : 'rgb(245, 158, 11)'
                          }}>
                            {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td>
                          <select
                            style={getStatusStyle(order.orderStatus)}
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
                          <td colSpan="8" style={{ padding: '0', background: 'var(--color-bg)' }}>
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
                                  <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Payment Details</p>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', padding: '0.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '4px', marginBottom: '1rem', border: '1px solid var(--color-border)' }}>
                                    {payments.find(p => p.orderId === order._id) ? (
                                      <>
                                        <p style={{ margin: '0 0 4px 0' }}><span style={{ fontWeight: 600 }}>Gateway:</span> Cashfree Payments</p>
                                        <p style={{ margin: '0 0 4px 0' }}><span style={{ fontWeight: 600 }}>Payment ID:</span> {payments.find(p => p.orderId === order._id)?.cfOrderId}</p>
                                        <p style={{ margin: '0 0 4px 0' }}><span style={{ fontWeight: 600 }}>Status:</span> {payments.find(p => p.orderId === order._id)?.status}</p>
                                        <p style={{ margin: 0 }}><span style={{ fontWeight: 600 }}>Session:</span> {payments.find(p => p.orderId === order._id)?.cfPaymentSessionId?.substring(0, 15)}...</p>
                                      </>
                                    ) : (
                                      <p style={{ margin: 0, fontStyle: 'italic' }}>{order.paymentStatus === 'paid' ? 'Paid via Cashfree Gateway' : 'No payment records found yet'}</p>
                                    )}
                                  </div>

                                  <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Order Timeline</p>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.6, padding: '0.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '4px', border: '1px solid var(--color-border)', marginBottom: '1rem' }}>
                                    <p style={{ margin: '0 0 4px 0' }}><span style={{ fontWeight: 600 }}>Placed On:</span> {formatDate(order.createdAt)}</p>
                                    {order.orderStatus !== 'pending' && (
                                      <p style={{ margin: 0 }}><span style={{ fontWeight: 600 }}>Last Updated:</span> {formatDate(order.updatedAt)}</p>
                                    )}
                                  </div>

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
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: currentPage === 1 ? 'transparent' : 'var(--color-bg-alt)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                >
                  Previous
                </button>
                <button 
                  disabled={currentPage * itemsPerPage >= filteredOrders.length}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: currentPage * itemsPerPage >= filteredOrders.length ? 'transparent' : 'var(--color-bg-alt)', cursor: currentPage * itemsPerPage >= filteredOrders.length ? 'not-allowed' : 'pointer', opacity: currentPage * itemsPerPage >= filteredOrders.length ? 0.5 : 1 }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
