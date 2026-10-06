import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import './Orders.css';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  processing: { label: 'Processing', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  shipped:    { label: 'Shipped',    color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  delivered:  { label: 'Delivered',  color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  cancelled:  { label: 'Cancelled',  color: '#ef4444', bg: '#fff1f2', border: '#fecaca' },
};

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
        <div className="orders-page-header">
          <h1>My Orders</h1>
          <p>{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              <Package size={40} strokeWidth={1} />
            </div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here.</p>
            <Link to="/products" className="btn btn-primary">
              <ShoppingBag size={16} /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
              const firstImg = order.items?.[0]?.image;
              return (
                <Link to={`/orders/${order._id}`} key={order._id} className="order-card">
                  {/* Left: images + info */}
                  <div className="order-card-left">
                    <div className="order-thumbs">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="order-thumb">
                          {item.image
                            ? <img src={item.image} alt={item.name} />
                            : <Package size={16} style={{ color: '#a1a1aa' }} />
                          }
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="order-thumb more">+{order.items.length - 3}</div>
                      )}
                    </div>
                    <div className="order-info">
                      <p className="order-id">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="order-meta">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                        &nbsp;·&nbsp;
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Right: amount + status */}
                  <div className="order-card-right">
                    <p className="order-amount">₹{order.totalAmount.toFixed(2)}</p>
                    <span
                      className="order-status-badge"
                      style={{ color: status.color, background: status.bg, border: `1px solid ${status.border}` }}
                    >
                      {status.label}
                    </span>
                    <ChevronRight size={18} style={{ color: '#a1a1aa' }} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
