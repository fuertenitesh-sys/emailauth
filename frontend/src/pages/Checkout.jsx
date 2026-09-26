import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Phone, Mail, User, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, getDiscountedPrice } = useCart();
  const { addToast } = useToast();
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', address: '', city: '', state: '', pincode: '' });

  const deliveryCharge = cartTotal > 500 ? 0 : 50;
  const totalAmount = cartTotal + deliveryCharge;
  const items = cart.items || [];

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (items.length === 0) { addToast('Your cart is empty!', 'warning'); return; }
    setPlacing(true);
    try {
      const res = await axios.post('/api/orders', { shippingAddress: form });
      addToast('Order placed successfully!', 'success');
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      if (err.response?.status === 401) {
        addToast('Please login to place an order', 'warning');
        navigate('/login');
      } else {
        addToast(err.response?.data?.message || 'Failed to place order', 'error');
      }
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-layout">
          <form className="checkout-form card" onSubmit={handleSubmit}>
            <h2 className="checkout-section-title"><MapPin size={18} /> Shipping Details</h2>
            <div className="checkout-fields">
              <div className="input-group">
                <label className="input-label">Full Name *</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} className="input-field" required placeholder="Your full name" />
              </div>
              <div className="input-group">
                <label className="input-label">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="input-field" required placeholder="10-digit mobile number" pattern="[0-9]{10}" />
              </div>
              <div className="input-group checkout-full">
                <label className="input-label">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" required placeholder="your@email.com" />
              </div>
              <div className="input-group checkout-full">
                <label className="input-label">Address *</label>
                <textarea name="address" value={form.address} onChange={handleChange} className="input-field" required placeholder="House/Flat no., Street, Area" rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div className="input-group">
                <label className="input-label">City *</label>
                <input name="city" value={form.city} onChange={handleChange} className="input-field" required placeholder="City" />
              </div>
              <div className="input-group">
                <label className="input-label">State *</label>
                <input name="state" value={form.state} onChange={handleChange} className="input-field" required placeholder="State" />
              </div>
              <div className="input-group">
                <label className="input-label">Pincode *</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} className="input-field" required placeholder="6-digit pincode" pattern="[0-9]{6}" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={placing} style={{ marginTop: '1.5rem' }}>
              <CheckCircle size={18} /> {placing ? 'Placing Order...' : `Place Order ₹${totalAmount.toFixed(2)}`}
            </button>
          </form>

          <div className="checkout-summary card">
            <h3 className="checkout-section-title">Order Summary</h3>
            <div className="checkout-items">
              {items.map(item => {
                const p = item.product;
                if (!p) return null;
                const price = getDiscountedPrice(p.price, p.discount);
                return (
                  <div key={item._id} className="checkout-item">
                    <div className="checkout-item-img">
                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : null}
                    </div>
                    <div className="checkout-item-details">
                      <span className="checkout-item-name">{p.name}</span>
                      <span className="checkout-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="checkout-item-price">₹{(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="checkout-summary-row"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
            <div className="checkout-summary-row"><span>Delivery</span><span style={{ color: deliveryCharge === 0 ? 'var(--color-success)' : 'inherit' }}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
            <div className="checkout-summary-divider" />
            <div className="checkout-summary-total"><span>Total</span><span>₹{totalAmount.toFixed(2)}</span></div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1rem', textAlign: 'center' }}>Payment: Cash on Delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
