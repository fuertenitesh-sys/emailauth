import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Package, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';
import './OrderDetail.css';

const statusColors = { pending: 'badge-warning', processing: 'badge-primary', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger' };

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader"><div className="loading-spinner" /></div>;
  if (!order) return <div className="container" style={{ padding: '4rem' }}><p>Order not found.</p></div>;

  const addr = order.shippingAddress;
  const isNew = new Date() - new Date(order.createdAt) < 5000;

  return (
    <div className="order-detail-page">
      <div className="container">
        <Link to="/orders" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> My Orders
        </Link>

        {/* Success banner for new orders */}
        {order.orderStatus === 'pending' && (
          <div className="order-success-banner">
            <CheckCircle size={24} style={{ color: 'var(--color-success)' }} />
            <div>
              <h3>Order Placed Successfully!</h3>
              <p>Order ID: <strong>#{order._id.slice(-8).toUpperCase()}</strong></p>
            </div>
          </div>
        )}

        <div className="order-detail-grid">
          {/* Items */}
          <div className="order-detail-items card">
            <div className="order-detail-header">
              <div>
                <h2>Order #{order._id.slice(-8).toUpperCase()}</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <span className={`badge ${statusColors[order.orderStatus] || 'badge-neutral'}`} style={{ fontSize: '0.875rem', padding: '0.375rem 0.875rem' }}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
            </div>
            {order.items.map((item, i) => (
              <div key={i} className="order-item-row">
                <div className="order-item-img">
                  {item.image ? <img src={item.image} alt={item.name} /> : <Package size={24} style={{ color: 'var(--color-border)' }} />}
                </div>
                <div className="order-item-info">
                  <p className="order-item-name">{item.name}</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                </div>
                <p className="order-item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="order-price-summary">
              <div className="order-price-row"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
              <div className="order-price-row"><span>Delivery</span><span style={{ color: order.deliveryCharge === 0 ? 'var(--color-success)' : 'inherit' }}>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span></div>
              <div className="order-price-row total"><span>Total</span><span>₹{order.totalAmount.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Shipping */}
          <div>
            <div className="order-shipping card">
              <h3><MapPin size={18} style={{ display: 'inline', marginRight: '0.375rem' }} /> Delivery Address</h3>
              <p className="ship-name">{addr.fullName}</p>
              <p className="ship-text">{addr.address}</p>
              <p className="ship-text">{addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="ship-text">{addr.phone}</p>
              <p className="ship-text">{addr.email}</p>
            </div>
            <div className="order-payment card" style={{ marginTop: '1rem' }}>
              <h3>Payment</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Cash on Delivery</p>
              <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`} style={{ marginTop: '0.5rem' }}>
                {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
