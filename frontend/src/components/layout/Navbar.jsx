import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItemCount } = useCart();
  const { user, logout } = useContext(AuthContext);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categories, setCategories] = useState([
    { _id: 'fallback_1', name: 'Books' },
    { _id: 'fallback_2', name: 'Sports' },
    { _id: 'fallback_3', name: 'Electronics' },
    { _id: 'fallback_4', name: 'Shoes' }
  ]);
  
  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data)).catch(() => setCategories([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          
          {/* Mobile Menu Toggle */}
          <button className="navbar-mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>

          {/* Left Navigation */}
          <div className="navbar-links-left" onMouseLeave={() => setHoveredCategory(null)}>
            {categories.slice(0, 5).map(cat => (
              <div 
                key={cat._id} 
                className="navbar-link-wrapper"
                onMouseEnter={() => setHoveredCategory(cat._id)}
              >
                <Link to={`/products?category=${cat.name.toLowerCase()}`} className="navbar-link">{cat.name}</Link>
                
                {hoveredCategory === cat._id && (
                  <div className="mega-menu">
                    <div className="container mega-menu-container">
                      <div className="mega-menu-grid">
                        <div className="mega-column">
                          <h4>Top Brands</h4>
                          <Link to={`/products?category=${cat.name.toLowerCase()}&brand=nike`} onClick={() => setHoveredCategory(null)}>Nike</Link>
                          <Link to={`/products?category=${cat.name.toLowerCase()}&brand=adidas`} onClick={() => setHoveredCategory(null)}>Adidas</Link>
                          <Link to={`/products?category=${cat.name.toLowerCase()}&brand=puma`} onClick={() => setHoveredCategory(null)}>Puma</Link>
                          <Link to={`/products?category=${cat.name.toLowerCase()}&brand=newbalance`} onClick={() => setHoveredCategory(null)}>New Balance</Link>
                        </div>
                        <div className="mega-column">
                          <h4>Collections</h4>
                          <Link to={`/products?category=${cat.name.toLowerCase()}`} onClick={() => setHoveredCategory(null)}>New Arrivals</Link>
                          <Link to={`/products?category=${cat.name.toLowerCase()}`} onClick={() => setHoveredCategory(null)}>Best Sellers</Link>
                          <Link to={`/products?category=${cat.name.toLowerCase()}`} onClick={() => setHoveredCategory(null)}>Trending Now</Link>
                          <Link to={`/products?category=${cat.name.toLowerCase()}`} onClick={() => setHoveredCategory(null)}>Limited Edition</Link>
                        </div>
                        <div className="mega-column">
                          <h4>Categories</h4>
                          <Link to={`/products?category=${cat.name.toLowerCase()}`} onClick={() => setHoveredCategory(null)}>All {cat.name}</Link>
                          <Link to={`/products?category=${cat.name.toLowerCase()}`} onClick={() => setHoveredCategory(null)}>Premium {cat.name}</Link>
                          <Link to={`/products?category=${cat.name.toLowerCase()}`} onClick={() => setHoveredCategory(null)}>Essentials</Link>
                          <Link to={`/products?category=${cat.name.toLowerCase()}`} onClick={() => setHoveredCategory(null)}>Sale</Link>
                        </div>
                        <div className="mega-image-col">
                           <div className="mega-image-wrapper">
                             <img src="/images/blog/shoes-minimalist.jpg" alt={cat.name} />
                             <div className="mega-image-text">
                               <h3>{cat.name.toUpperCase()}</h3>
                               <p>PREMIUM SELECTION</p>
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link to="/products" className="navbar-link" onMouseEnter={() => setHoveredCategory(null)}>Shop All</Link>
          </div>

          {/* Center Brand */}
          <Link to="/" className="navbar-brand">
            LUMEN
          </Link>

          {/* Right Icons */}
          <div className="navbar-actions-right">
            <button className="navbar-icon-btn" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            <div className="navbar-user-menu" 
                 onMouseEnter={() => setIsUserMenuOpen(true)}
                 onMouseLeave={() => setIsUserMenuOpen(false)}>
              <button className="navbar-icon-btn" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <User size={20} strokeWidth={1.5} />
              </button>
              <div className={`navbar-dropdown ${isUserMenuOpen ? 'show' : ''}`}>
                {user ? (
                  <>
                    <div className="navbar-dropdown-header">Hi, {user.name?.split(' ')[0]}</div>
                    <Link to="/orders" className="navbar-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>My Orders</Link>
                    <Link to="/dashboard" className="navbar-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>Profile</Link>
                    {user.role === 'admin' && <Link to="/admin/dashboard" className="navbar-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>Admin Panel</Link>}
                    <button className="navbar-dropdown-item text-danger" onClick={() => { setIsUserMenuOpen(false); handleLogout(); }}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="navbar-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>Log In</Link>
                    <Link to="/signup" className="navbar-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>Create Account</Link>
                  </>
                )}
              </div>
            </div>

            <Link to="/cart" className="navbar-icon-btn navbar-cart">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartItemCount > 0 && <span className="navbar-cart-badge">{cartItemCount}</span>}
            </Link>
          </div>

        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="navbar-search-overlay">
            <div className="container">
              <form onSubmit={handleSearch} className="navbar-search-form">
                <Search size={20} strokeWidth={1.5} color="#71717a" />
                <input
                  type="text"
                  placeholder="SEARCH LUMEN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="button" onClick={() => setIsSearchOpen(false)}><X size={20} strokeWidth={1.5} /></button>
              </form>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            {categories.map(cat => (
              <Link key={cat._id} to={`/products?category=${cat.name.toLowerCase()}`} className="mobile-link" onClick={() => setIsMenuOpen(false)}>{cat.name}</Link>
            ))}
            <Link to="/products" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
            <hr className="mobile-divider" />
            <Link to="/orders" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Account</Link>
            <Link to="/cart" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Cart ({cartItemCount})</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
