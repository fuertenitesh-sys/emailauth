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
  const [categoryProducts, setCategoryProducts] = useState({}); // { catId: [products] }
  
  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data)).catch(() => setCategories([]));
  }, []);

  const handleCategoryHover = (cat) => {
    setHoveredCategory(cat._id);
    // Fetch products for this category only once and cache
    if (!categoryProducts[cat._id]) {
      axios.get(`/api/products?limit=8&category=${encodeURIComponent(cat.name)}`)
        .then(res => {
          const list = res.data.products || res.data || [];
          setCategoryProducts(prev => ({ ...prev, [cat._id]: list }));
        })
        .catch(() => {});
    }
  };

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
        <div className="container navbar-inner" onMouseLeave={() => setHoveredCategory(null)}>
          
          {/* Mobile Menu Toggle */}
          <button className="navbar-mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>

          {/* Left Navigation */}
          <div className="navbar-links-left">
            {categories.slice(0, 5).map(cat => (
              <div
                key={cat._id}
                className="navbar-link-wrapper"
                onMouseEnter={() => handleCategoryHover(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link to={`/products?category=${cat.name.toLowerCase()}`} className="navbar-link">
                  {cat.name}
                </Link>

                {hoveredCategory === cat._id && (
                  <div className="cat-dropdown">
                    {/* Header link — view all */}
                    <Link
                      to={`/products?category=${cat.name.toLowerCase()}`}
                      className="cat-dropdown-header"
                      onClick={() => setHoveredCategory(null)}
                    >
                      All {cat.name}
                    </Link>

                    <div className="cat-dropdown-divider" />

                    {/* Real products from backend */}
                    {!categoryProducts[cat._id] ? (
                      <div className="cat-dropdown-loading">Loading…</div>
                    ) : categoryProducts[cat._id].length === 0 ? (
                      <div className="cat-dropdown-loading">No products found</div>
                    ) : (
                      categoryProducts[cat._id].map(p => (
                        <Link
                          key={p._id}
                          to={`/products/${p._id}`}
                          className="cat-dropdown-item"
                          onClick={() => setHoveredCategory(null)}
                        >
                          {p.images?.[0] && (
                            <img src={p.images[0]} alt={p.name} className="cat-dropdown-img" />
                          )}
                          <span className="cat-dropdown-name">{p.name}</span>
                        </Link>
                      ))
                    )}
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
