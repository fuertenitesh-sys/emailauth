import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, Package, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { cartItemCount } = useCart();

  // Check auth from cookie via simple fetch
  const [user, setUser] = useState(null);
  
  useState(() => {
    axios.get('/api/auth/me').then(res => setUser(res.data)).catch(() => setUser(null));
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      navigate('/');
    } catch {}
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <Package size={22} />
          <span>ShopEase</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={16} className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar-search-input"
          />
        </form>

        <div className="navbar-links">
          <Link to="/products" className="navbar-link">Products</Link>
          <Link to="/cart" className="navbar-cart-btn">
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="navbar-cart-badge">{cartItemCount}</span>
            )}
          </Link>
          {user ? (
            <div className="navbar-user-menu">
              <button className="navbar-user-btn">
                <User size={18} /> {user.name?.split(' ')[0]}
              </button>
              <div className="navbar-dropdown">
                <Link to="/orders" className="navbar-dropdown-item"><Package size={14} /> My Orders</Link>
                <Link to="/dashboard" className="navbar-dropdown-item"><User size={14} /> Profile</Link>
                <button className="navbar-dropdown-item" onClick={handleLogout}><LogOut size={14} /> Logout</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>

        <button className="navbar-mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="navbar-mobile-menu">
          <form onSubmit={handleSearch} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input-field" style={{ flex: 1 }} />
              <button type="submit" className="btn btn-primary btn-sm"><Search size={14} /></button>
            </div>
          </form>
          <Link to="/products" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
          <Link to="/cart" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>Cart {cartItemCount > 0 && `(${cartItemCount})`}</Link>
          <Link to="/orders" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
          {user ? (
            <button className="navbar-mobile-link" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
