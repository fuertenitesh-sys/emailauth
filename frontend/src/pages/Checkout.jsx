import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, CheckCircle, Lock, RefreshCw, Headphones, Truck, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './Checkout.css';

const STEPS = ['Cart', 'Details', 'Confirmation'];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, getDiscountedPrice } = useCart();
  const { addToast } = useToast();
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', address: '', city: '', state: '', pincode: ''
  });

  const deliveryCharge = cartTotal > 500 ? 0 : 50;
  const totalAmount = cartTotal + deliveryCharge;
  const items = cart.items || [];

  const totalSavings = items.reduce((acc, item) => {
    const p = item.product;
    if (!p) return acc;
    return acc + (p.price * (p.discount || 0) / 100) * item.quantity;
  }, 0);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (items.length === 0) { addToast('Your cart is empty!', 'warning'); return; }
    setPlacing(true);
    try {
      const res = await axios.post('/api/orders', { shippingAddress: form });
      addToast('Order placed successfully! 🎉', 'success');
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
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', background: '#fafafa' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Your cart is empty</p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Step Indicator */}
        <div className="checkout-steps">
          {STEPS.map((step, i) => (
            <div key={step} className={`checkout-step ${i === 1 ? 'active' : i < 1 ? 'done' : ''}`}>
              <div className="checkout-step-circle">
                {i < 1 ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span>{step}</span>
              {i < STEPS.length - 1 && <div className="checkout-step-line" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-form-card">
              <h2 className="checkout-section-title">
                <MapPin size={18} /> Shipping Details
              </h2>
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
            </div>

            {/* Payment Method */}
            <div className="checkout-form-card" style={{ marginTop: '1.25rem' }}>
              <h2 className="checkout-section-title">Payment Method</h2>
              <div className="payment-option selected">
                <div className="payment-option-radio" />
                <div className="payment-option-info">
                  <span>Cash on Delivery</span>
                  <small>Pay when your order arrives</small>
                </div>
                <Truck size={20} style={{ color: '#111', marginLeft: 'auto' }} />
              </div>
              <p className="payment-note">Online payment coming soon. Currently only COD is available.</p>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={placing}
              style={{ marginTop: '1.5rem' }}
            >
              <Lock size={16} />
              {placing ? 'Placing Order...' : `Place Order • ₹${totalAmount.toFixed(2)}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="checkout-summary-panel">
            <div className="checkout-summary-card">
              <h3>Order Summary</h3>
              <div className="checkout-items">
                {items.map(item => {
                  const p = item.product;
                  if (!p) return null;
                  const price = getDiscountedPrice(p.price, p.discount);
                  return (
                    <div key={item._id} className="checkout-item">
                      <div className="checkout-item-img">
                        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : <div className="checkout-img-placeholder" />}
                        <span className="checkout-item-qty-badge">{item.quantity}</span>
                      </div>
                      <div className="checkout-item-details">
                        <span className="checkout-item-name">{p.name}</span>
                        {p.discount > 0 && (
                          <span className="checkout-item-discount">−{p.discount}% off</span>
                        )}
                      </div>
                      <span className="checkout-item-price">₹{(price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="checkout-summary-rows">
                <div className="checkout-summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="checkout-summary-row" style={{ color: '#16a34a' }}>
                    <span>Discount</span>
                    <span>−₹{totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="checkout-summary-row">
                  <span>Delivery</span>
                  <span className={deliveryCharge === 0 ? 'free-label' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
              </div>
              <div className="checkout-summary-divider" />
              <div className="checkout-summary-total">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="checkout-trust">
              <div className="checkout-trust-item"><Lock size={14} /> Secure Checkout</div>
              <div className="checkout-trust-item"><RefreshCw size={14} /> 30-Day Returns</div>
              <div className="checkout-trust-item"><Headphones size={14} /> 24/7 Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
