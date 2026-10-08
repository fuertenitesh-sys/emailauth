import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Package, MapPin, ArrowLeft, CheckCircle, Clock, Truck, Home } from 'lucide-react';
import './OrderDetail.css';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', step: 0 },
  processing: { label: 'Processing', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', step: 1 },
  shipped:    { label: 'Shipped',    color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', step: 2 },
  delivered:  { label: 'Delivered',  color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', step: 3 },
  cancelled:  { label: 'Cancelled',  color: '#ef4444', bg: '#fff1f2', border: '#fecaca', step: -1 },
};

const TRACKING_STEPS = [
  { key: 'pending',    label: 'Order Placed',  Icon: CheckCircle },
  { key: 'processing', label: 'Processing',    Icon: Clock },
  { key: 'shipped',    label: 'Shipped',       Icon: Truck },
  { key: 'delivered',  label: 'Delivered',     Icon: Home },
];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = () => {
    axios.get(`/api/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const loadCashfreeScript = () => {
    return new Promise((resolve) => {
      if (window.Cashfree) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentRetry = async () => {
    setPaying(true);
    try {
      const resScript = await loadCashfreeScript();
      if (!resScript) {
        alert('Cashfree SDK failed to load.');
        setPaying(false);
        return;
      }

      const paymentRes = await axios.post('/api/payment/create-order', { orderId: order._id });

      const cashfree = window.Cashfree({
        mode: "sandbox",
      });

      let checkoutOptions = {
        paymentSessionId: paymentRes.data.paymentSessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then(async (result) => {
        if(result.error){
          alert('Payment Failed or Closed. Please try again.');
          setPaying(false);
        }
        if(result.paymentDetails){
          try {
            setPaying(true);
            await axios.post('/api/payment/verify', {
              order_id: paymentRes.data.orderId
            });
            fetchOrder(); // refresh order to show PAID status
          } catch (err) {
            alert('Payment Verification Failed.');
          } finally {
            setPaying(false);
          }
        }
      });
    } catch (err) {
      alert('Failed to initiate payment retry.');
      setPaying(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!window.confirm('Are you sure you have received this order?')) return;
    setConfirming(true);
    try {
      const res = await axios.put(`/api/orders/${id}/deliver`);
      setOrder(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm delivery');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="loading-spinner" /></div>;
  if (!order) return (
    <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
      <p>Order not found.</p>
      <Link to="/orders" className="btn btn-outline" style={{ marginTop: '1rem' }}>Back to Orders</Link>
    </div>
  );

  const addr = order.shippingAddress;
  const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
  const currentStep = status.step;

  return (
    <div className="order-detail-page">
      <div className="container">
        <Link to="/orders" className="order-back-link">
          <ArrowLeft size={15} /> Back to Orders
        </Link>

        {/* Success Banner */}
        {order.orderStatus === 'pending' && (
          <div className="order-success-banner">
            <CheckCircle size={22} />
            <div>
              <h3>Order Placed Successfully! 🎉</h3>
              <p>Order ID: <strong>#{order._id.slice(-8).toUpperCase()}</strong> · We'll start processing it soon.</p>
            </div>
          </div>
        )}

        <div className="order-detail-grid">
          {/* Main Content */}
          <div>
            {/* Tracking */}
            {order.orderStatus !== 'cancelled' && (
              <div className="order-tracking-card">
                <h3>Order Tracking</h3>
                <div className="tracking-steps">
                  {TRACKING_STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <div key={step.key} className={`tracking-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                        <div className="tracking-step-icon">
                          <step.Icon size={16} />
                        </div>
                        <span>{step.label}</span>
                        {i < TRACKING_STEPS.length - 1 && (
                          <div className={`tracking-line ${i < currentStep ? 'done' : ''}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Items */}
            <div className="order-items-card">
              <div className="order-items-header">
                <div>
                  <h2>Order #{order._id.slice(-8).toUpperCase()}</h2>
                  <p className="order-date-text">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <span
                  className="order-status-tag"
                  style={{ color: status.color, background: status.bg, border: `1px solid ${status.border}` }}
                >
                  {status.label}
                </span>
              </div>

              {order.items.map((item, i) => (
                <div key={i} className="order-item-row">
                  <div className="order-item-img">
                    {item.image
                      ? <img src={item.image} alt={item.name} />
                      : <Package size={20} style={{ color: '#a1a1aa' }} />
                    }
                  </div>
                  <div className="order-item-info">
                    <p className="order-item-name">{item.name}</p>
                    <p className="order-item-meta">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                  </div>
                  <p className="order-item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}

              <div className="order-price-summary">
                <div className="order-price-row"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
                <div className="order-price-row">
                  <span>Delivery</span>
                  <span style={{ color: order.deliveryCharge === 0 ? '#16a34a' : 'inherit' }}>
                    {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
                  </span>
                </div>
                <div className="order-price-row total"><span>Total Paid</span><span>₹{order.totalAmount.toFixed(2)}</span></div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="order-shipping-card">
              <h3><MapPin size={16} /> Delivery Address</h3>
              <p className="ship-name">{addr.fullName}</p>
              <p className="ship-text">{addr.address}</p>
              <p className="ship-text">{addr.city}, {addr.state} – {addr.pincode}</p>
              <p className="ship-text">{addr.phone}</p>
              <p className="ship-text">{addr.email}</p>
            </div>

            <div className="order-payment-card">
              <h3>Payment</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (Cashfree)'}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    background: order.paymentStatus === 'paid' ? '#f0fdf4' : '#fffbeb',
                    color: order.paymentStatus === 'paid' ? '#16a34a' : '#d97706',
                    border: `1px solid ${order.paymentStatus === 'paid' ? '#bbf7d0' : '#fde68a'}`
                  }}
                >
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>

            {order.paymentMethod !== 'cod' && order.paymentStatus === 'pending' && !['cancelled', 'delivered'].includes(order.orderStatus) && (
              <button 
                className="btn btn-primary btn-full" 
                style={{ marginTop: '1rem', justifyContent: 'center' }}
                onClick={handlePaymentRetry}
                disabled={paying}
              >
                {paying ? 'Processing...' : 'Pay Now (Retry)'}
              </button>
            )}

            {order.orderStatus === 'shipped' && (
              <button 
                className="btn btn-primary btn-full" 
                style={{ marginTop: '1rem', justifyContent: 'center', background: '#16a34a', color: '#fff', borderColor: '#16a34a' }}
                onClick={handleConfirmDelivery}
                disabled={confirming}
              >
                {confirming ? 'Confirming...' : 'Confirm Delivery'}
              </button>
            )}

            <Link to="/products" className="btn btn-outline btn-full" style={{ marginTop: '1rem', justifyContent: 'center' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
