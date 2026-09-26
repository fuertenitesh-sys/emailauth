import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import './Orders.css';

const statusColors = { pending: 'badge-warning', processing: 'badge-primary', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger' };

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/orders/my')
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="loading-spinner" /></div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="orders-title">My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here.</p>
            <Link to="/products" className="btn btn-primary btn-lg"><ShoppingBag size={18} /> Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <Link to={`/orders/${order._id}`} key={order._id} className="order-card card card-hover">
                <div className="order-card-left">
                  <Package size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <div>
                    <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="order-card-right">
                  <p className="order-total">₹{order.totalAmount.toFixed(2)}</p>
                  <span className={`badge ${statusColors[order.orderStatus] || 'badge-neutral'}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                  <ChevronRight size={18} style={{ color: 'var(--color-text-muted)' }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
