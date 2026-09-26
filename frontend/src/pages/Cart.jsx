import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './Cart.css';

const Cart = () => {
  const { cart, cartLoading, cartTotal, updateCartItem, removeFromCart, getDiscountedPrice } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const deliveryCharge = cartTotal > 500 ? 0 : cartTotal > 0 ? 50 : 0;
  const finalTotal = cartTotal + deliveryCharge;

  const handleUpdateQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItem(itemId, newQty);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update quantity', 'error');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      addToast('Item removed from cart', 'info');
    } catch {
      addToast('Failed to remove item', 'error');
    }
  };

  if (cartLoading) return <div className="page-loader"><div className="loading-spinner" /></div>;

  const items = cart.items || [];

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started!</p>
          <Link to="/products" className="btn btn-primary btn-lg"><ShoppingBag size={18} /> Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Shopping Cart <span className="cart-count">({items.length} items)</span></h1>
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => {
              const p = item.product;
              if (!p) return null;
              const price = getDiscountedPrice(p.price, p.discount);
              return (
                <div key={item._id} className="cart-item card">
                  <div className="cart-item-image">
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : <ShoppingBag size={28} style={{ color: 'var(--color-border)' }} />}
                  </div>
                  <div className="cart-item-info">
                    <Link to={`/products/${p._id}`} className="cart-item-name">{p.name}</Link>
                    <div className="cart-item-price">₹{price.toFixed(2)}</div>
                    {p.discount > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>₹{p.price.toFixed(2)}</div>}
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => handleUpdateQty(item._id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus size={14} /></button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => handleUpdateQty(item._id, item.quantity + 1)} disabled={item.quantity >= p.stock}><Plus size={14} /></button>
                    </div>
                    <div className="cart-item-total">₹{(price * item.quantity).toFixed(2)}</div>
                    <button className="cart-item-remove" onClick={() => handleRemove(item._id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <h3 className="cart-summary-title">Order Summary</h3>
            <div className="cart-summary-row"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
            <div className="cart-summary-row">
              <span>Delivery</span>
              <span style={{ color: deliveryCharge === 0 ? 'var(--color-success)' : 'inherit' }}>
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            {deliveryCharge > 0 && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Add ₹{(500 - cartTotal).toFixed(2)} more for free delivery</p>}
            <div className="cart-summary-divider" />
            <div className="cart-summary-total"><span>Total</span><span>₹{finalTotal.toFixed(2)}</span></div>
            <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/checkout')} style={{ marginTop: '1rem' }}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <Link to="/products" className="btn btn-ghost btn-full" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
