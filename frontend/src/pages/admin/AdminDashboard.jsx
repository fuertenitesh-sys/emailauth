import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, LogOut, Users, ShoppingBag, Package, Tag, TrendingUp, Clock, ChevronRight, LogIn } from 'lucide-react';
import './Admin.css';
import AdminNav from './AdminNav';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes, ordersRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/orders')
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.slice(0, 5));
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await axios.post('/api/admin/logout'); } catch {}
    navigate('/admin');
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const statusColors = { pending: 'badge-warning', processing: 'badge-primary', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger' };

  return (
    <div className="admin-page-bg">
      <div className="admin-container">
        <header className="admin-header">
          <div className="admin-header-title-container">
            <div className="admin-header-icon"><Shield size={24} /></div>
            <h1 className="admin-title">Command Center</h1>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn"><LogOut size={16} /> Logout</button>
        </header>

        <AdminNav />

        {/* Stats */}
        <div className="admin-stats-row">
          {[
            { label: 'Total Users', value: stats?.totalUsers ?? users.length, icon: Users },
            { label: 'Total Products', value: stats?.totalProducts ?? '-', icon: Package },
            { label: 'Categories', value: stats?.totalCategories ?? '-', icon: Tag },
            { label: 'Total Orders', value: stats?.totalOrders ?? '-', icon: ShoppingBag },
            { label: 'Revenue', value: stats ? `₹${stats.revenue.toFixed(0)}` : '-', icon: TrendingUp },
            { label: 'Pending Orders', value: stats?.pendingOrders ?? '-', icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="admin-stat-card">
              <div className="admin-stat-icon-wrapper"><Icon size={24} /></div>
              <div className="admin-stat-info"><p>{label}</p><h3>{value}</h3></div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
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
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}><div className="loading-spinner" style={{ margin: '0 auto' }} /></div>
          ) : (
            <>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
                  <tbody>
                    {currentUsers.map((user, i) => (
                      <tr key={user._id}>
                        <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{indexOfFirst + i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{user.name}</td>
                        <td style={{ color: 'var(--color-text-muted)' }}>{user.email}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
