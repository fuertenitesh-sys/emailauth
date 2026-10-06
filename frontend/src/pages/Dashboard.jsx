import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, LogOut, Settings, Package, User as UserIcon } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(null);
  const [recentOrder, setRecentOrder] = useState(null);

  useEffect(() => {
    import('axios').then(({ default: axios }) => {
      axios.get('/api/orders/my')
        .then(res => {
          setOrderCount(res.data.length);
          if (res.data.length > 0) {
            setRecentOrder(res.data[0]);
          }
        })
        .catch(() => setOrderCount(0));
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="premium-dashboard">
      <div className="container pd-layout">
        
        {/* Sidebar Navigation */}
        <aside className="pd-sidebar">
          <div className="pd-user-info">
            <h2 className="pd-greeting">HELLO, {user?.name?.split(' ')[0] || 'USER'}</h2>
            <p className="pd-email">{user?.email}</p>
          </div>
          
          <nav className="pd-nav">
            <Link to="/dashboard" className="pd-nav-item active">
              <UserIcon size={18} strokeWidth={1.5} />
              <span>Account Overview</span>
            </Link>
            <Link to="/orders" className="pd-nav-item">
              <Package size={18} strokeWidth={1.5} />
              <span>Order History</span>
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="pd-nav-item">
                <Settings size={18} strokeWidth={1.5} />
                <span>Admin Dashboard</span>
              </Link>
            )}
            <button onClick={handleLogout} className="pd-nav-item logout">
              <LogOut size={18} strokeWidth={1.5} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="pd-main">
          <h1 className="pd-page-title">MY ACCOUNT</h1>
          
          <div className="pd-stats-row">
            <div className="pd-stat-box">
              <span className="pd-stat-label">TOTAL ORDERS</span>
              <span className="pd-stat-value">{orderCount === null ? '-' : orderCount}</span>
            </div>
            <div className="pd-stat-box">
              <span className="pd-stat-label">MEMBER STATUS</span>
              <span className="pd-stat-value">VIP</span>
            </div>
          </div>

          {/* Profile Details */}
          <section className="pd-section">
            <div className="pd-section-header">
              <h3>PROFILE DETAILS</h3>
              <button className="pd-edit-btn">EDIT</button>
            </div>
            <div className="pd-details-grid">
              <div className="pd-detail-item">
                <label>FULL NAME</label>
                <p>{user?.name}</p>
              </div>
              <div className="pd-detail-item">
                <label>EMAIL ADDRESS</label>
                <p>{user?.email}</p>
              </div>
              <div className="pd-detail-item">
                <label>PASSWORD</label>
                <p>••••••••</p>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="pd-section">
            <div className="pd-section-header">
              <h3>RECENT ACTIVITY</h3>
              <Link to="/orders" className="pd-edit-btn">VIEW ALL</Link>
            </div>
            {recentOrder ? (
              <div className="pd-recent-order">
                <div className="pd-ro-header">
                  <div>
                    <p className="pd-ro-id">ORDER #{recentOrder._id.slice(-8).toUpperCase()}</p>
                    <p className="pd-ro-date">{new Date(recentOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="pd-ro-status" data-status={recentOrder.orderStatus}>
                    {recentOrder.orderStatus.toUpperCase()}
                  </div>
                </div>
                <div className="pd-ro-footer">
                  <span className="pd-ro-total">${recentOrder.totalAmount.toFixed(2)}</span>
                  <Link to={`/orders/${recentOrder._id}`} className="pd-ro-link">
                    TRACK <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="pd-empty-state">
                <p>You haven't placed any orders yet.</p>
                <Link to="/products" className="pd-shop-btn">SHOP NOW</Link>
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
