import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield, RefreshCw, Headphones } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, cartLoading, cartTotal, updateCartItem, removeFromCart, getDiscountedPrice } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const deliveryCharge = cartTotal > 500 ? 0 : cartTotal > 0 ? 50 : 0;
  const finalTotal = cartTotal + deliveryCharge;

  // Calculate total savings
  const totalSavings = (cart.items || []).reduce((acc, item) => {
    const p = item.product;
    if (!p) return acc;
    const discountAmt = (p.price * (p.discount || 0)) / 100;
    return acc + discountAmt * item.quantity;
  }, 0);

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
      <div className="cart-empty-page">
        <div className="cart-empty-content">
          <div className="cart-empty-icon">
            <ShoppingBag size={48} strokeWidth={1} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-page-header">
          <h1>Shopping Cart</h1>
          <span className="cart-item-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => {
              const p = item.product;
              if (!p) return null;
              const price = getDiscountedPrice(p.price, p.discount);
              return (
                <div key={item._id} className="cart-item">
                  <Link to={`/products/${p._id}`} className="cart-item-image">
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name} />
                      : <div className="cart-item-img-placeholder"><ShoppingBag size={24} /></div>
                    }
                  </Link>
                  <div className="cart-item-body">
                    <div className="cart-item-top">
                      <Link to={`/products/${p._id}`} className="cart-item-name">{p.name}</Link>
                      <button className="cart-item-remove" onClick={() => handleRemove(item._id)} title="Remove">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {p.category?.name && (
                      <span className="cart-item-category">{p.category.name}</span>
                    )}
                    <div className="cart-item-bottom">
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={() => handleUpdateQty(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <Minus size={13} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => handleUpdateQty(item._id, item.quantity + 1)} disabled={item.quantity >= p.stock}>
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="cart-item-pricing">
                        <span className="cart-item-price">₹{(price * item.quantity).toFixed(2)}</span>
                        {p.discount > 0 && (
                          <span className="cart-item-original">₹{(p.price * item.quantity).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <div className="cart-summary-card">
              <h3>Order Summary</h3>
              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="cart-summary-row savings">
                    <span>Discount</span>
                    <span>−₹{totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="cart-summary-row">
                  <span>Delivery</span>
                  <span className={deliveryCharge === 0 ? 'free-delivery' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="cart-free-shipping-hint">
                    Add ₹{(500 - cartTotal).toFixed(2)} more for FREE delivery
                  </p>
                )}
              </div>
              <div className="cart-summary-divider" />
              <div className="cart-summary-total">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="cart-savings-badge">
                  🎉 You save ₹{totalSavings.toFixed(2)} on this order!
                </div>
              )}
              <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/checkout')} style={{ marginTop: '1.25rem' }}>
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <Link to="/products" className="btn btn-ghost btn-full" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
                Continue Shopping
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="cart-trust-badges">
              <div className="trust-badge">
                <Shield size={16} />
                <span>100% Secure Checkout</span>
              </div>
              <div className="trust-badge">
                <RefreshCw size={16} />
                <span>Easy 30-Day Returns</span>
              </div>
              <div className="trust-badge">
                <Headphones size={16} />
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
