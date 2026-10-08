import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Users, ShoppingBag, Package, Tag, TrendingUp, Clock, ChevronRight, CreditCard, RefreshCw, Truck, CheckCircle, XCircle } from 'lucide-react';
import './Admin.css';
import AdminNav from './AdminNav';
import AdminHeader from '../../components/admin/AdminHeader';
import { adminCache, setAdminCache } from '../../utils/adminCache';

const AdminDashboard = () => {
  const [users, setUsers] = useState(adminCache.users || []);
  const [stats, setStats] = useState(adminCache.stats);
  const [recentOrders, setRecentOrders] = useState(adminCache.recentOrders || []);
  const [loading, setLoading] = useState(!adminCache.users);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/admin/dashboard';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, [location.pathname]);

  const fetchData = async () => {
    try {
      if (isDashboard) {
        const [usersRes, statsRes, ordersRes] = await Promise.all([
          axios.get('/api/admin/users'),
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/orders')
        ]);
        setAdminCache('users', usersRes.data);
        setAdminCache('stats', statsRes.data);
        setAdminCache('recentOrders', ordersRes.data.slice(0, 5));
        setUsers(adminCache.users);
        setStats(adminCache.stats);
        setRecentOrders(adminCache.recentOrders);
      } else {
        const res = await axios.get('/api/admin/users');
        setAdminCache('users', res.data);
        setUsers(adminCache.users);
      }
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const statusColors = { pending: 'badge-warning', processing: 'badge-primary', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger' };

  return (
    <div className="admin-page-bg">
      <AdminNav />
      <div className="admin-main-wrapper">
        <AdminHeader title={isDashboard ? 'Command Center' : 'Users Management'} />

        {/* Stats */}
        {isDashboard && (
          <div className="admin-stats-row">
          {[
            { label: 'Total Users', value: stats?.totalUsers ?? users.length, icon: Users, link: '/admin/users', color: '#3B82F6' },
            { label: 'Total Products', value: stats?.totalProducts ?? '-', icon: Package, link: '/admin/products', color: '#8B5CF6' },
            { label: 'Categories', value: stats?.totalCategories ?? '-', icon: Tag, link: '/admin/categories', color: '#06B6D4' },
            { label: 'Total Orders', value: stats?.totalOrders ?? '-', icon: ShoppingBag, link: '/admin/orders', color: '#10B981' },
            { label: 'Revenue', value: stats ? `₹${stats.revenue.toFixed(0)}` : '-', icon: TrendingUp, link: '/admin/orders', color: '#F59E0B' },
            { label: 'Successful Payments', value: stats?.successfulPayments ?? '-', icon: CreditCard, link: '/admin/payments', color: '#10B981' },
            { label: 'Pending Orders', value: stats?.pendingOrders ?? '-', icon: Clock, link: '/admin/orders?status=pending', color: '#F59E0B' },
            { label: 'Processing Orders', value: stats?.processingOrders ?? '-', icon: RefreshCw, link: '/admin/orders?status=processing', color: '#3B82F6' },
            { label: 'Shipped Orders', value: stats?.shippedOrders ?? '-', icon: Truck, link: '/admin/orders?status=shipped', color: '#8B5CF6' },
            { label: 'Delivered Orders', value: stats?.deliveredOrders ?? '-', icon: CheckCircle, link: '/admin/orders?status=delivered', color: '#10B981' },
            { label: 'Cancelled Orders', value: stats?.cancelledOrders ?? '-', icon: XCircle, link: '/admin/orders?status=cancelled', color: '#EF4444' },
          ].map(({ label, value, icon: Icon, link, color }) => (
            <div 
              key={label} 
              className="admin-stat-card clickable-stat-card"
              onClick={() => navigate(link)}
              style={{ '--hover-color': color }}
            >
              <div className="admin-stat-icon-wrapper"><Icon size={24} /></div>
              <div className="admin-stat-info"><p>{label}</p><h3>{value}</h3></div>
            </div>
          ))}
        </div>
        )}

        {/* Recent Orders */}
        {isDashboard && recentOrders.length > 0 && (
          <div className="admin-table-container" style={{ marginBottom: '2rem' }}>
            <div className="admin-table-header-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Recent Orders</h2>
              <a href="/admin/orders" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>View All <ChevronRight size={14} /></a>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o._id}>
                      <td style={{ fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'monospace' }}>#{o._id.slice(-8).toUpperCase()}</td>
                      <td>{o.user?.name || 'N/A'}</td>
                      <td style={{ fontWeight: 600 }}>₹{o.totalAmount.toFixed(2)}</td>
                      <td><span className={`badge ${statusColors[o.orderStatus] || 'badge-neutral'}`}>{o.orderStatus}</span></td>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{formatDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="admin-table-container">
          <div className="admin-table-header-title"><h2>Registered Users</h2></div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
              <tbody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="skeleton-row">
                      <td><div className="skeleton-cell short"></div></td>
                      <td><div className="skeleton-cell medium"></div></td>
                      <td><div className="skeleton-cell long"></div></td>
                      <td><div className="skeleton-cell medium"></div></td>
                    </tr>
                  ))
                ) : currentUsers.length > 0 ? (
                  currentUsers.map((user, i) => (
                    <tr key={user._id}>
                      <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{indexOfFirst + i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{user.name}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{user.email}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{formatDate(user.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {!loading && totalPages > 0 && (
            <div className="admin-pagination">
              <span className="admin-page-info">Showing {indexOfFirst + 1}–{Math.min(indexOfLast, users.length)} of {users.length}</span>
              <div className="admin-page-controls">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="admin-page-btn">Prev</button>
                <div className="admin-page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i+1} onClick={() => setCurrentPage(i+1)} className={`admin-page-num ${currentPage === i+1 ? 'active' : ''}`}>{i+1}</button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="admin-page-btn">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
