import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, ArrowRight, Truck, Shield, RefreshCw, Headphones, Star, Zap, Package } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import './Home.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/products?limit=8')
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        {/* Floating particles */}
        <div className="hero-particle particle-1" />
        <div className="hero-particle particle-2" />
        <div className="hero-particle particle-3" />
        <div className="hero-particle particle-4" />

        <div className="container hero-content">
          {/* Left: Text */}
          <div className="hero-text">
            <span className="hero-eyebrow">✦ New Arrivals 2026</span>
            <h1 className="hero-title">
              Discover
              <span className="hero-title-gradient"> Premium</span>
              <br />Products for Every
              <br />Lifestyle
            </h1>
            <p className="hero-subtitle">
              Shop the latest trends across Electronics, Fashion, Home & more.
              Free delivery on orders above ₹500.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                <ShoppingBag size={18} /> Shop Now
              </Link>
              <Link to="/products" className="btn btn-outline btn-lg">Browse Categories</Link>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hero-stat-item">
                <span className="hero-stat-num">10K+</span>
                <span className="hero-stat-label">Products</span>
              </div>
              <div className="hero-stat-item">
                <span className="hero-stat-num">50K+</span>
                <span className="hero-stat-label">Happy Customers</span>
              </div>
              <div className="hero-stat-item">
                <span className="hero-stat-num">4.9★</span>
                <span className="hero-stat-label">Avg Rating</span>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="hero-image-area">
            <div className="hero-visual">
              <div className="hero-main-card">
                <div className="hero-main-card-icon">
                  <ShoppingBag size={40} color="white" />
                </div>
                <span className="hero-main-card-text">ShopEase</span>
              </div>

              {/* Floating orbit cards */}
              <div className="hero-orbit-card hero-orbit-card-1">
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>New Order</div>
                  <div>₹2,499</div>
                </div>
              </div>
              <div className="hero-orbit-card hero-orbit-card-2">
                <Star size={14} color="#f59e0b" fill="#f59e0b" />
                <span>4.9 Rating</span>
              </div>
              <div className="hero-orbit-card hero-orbit-card-3">
                <Truck size={14} color="#10b981" />
                <span>Free Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section className="trust-section">
        <div className="container trust-grid">
          <div className="trust-item">
            <div className="trust-item-icon trust-icon-blue">
              <Truck size={22} color="#2563eb" />
            </div>
            <div>
              <h4>Free Delivery</h4>
              <p>On orders above ₹500</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-item-icon trust-icon-green">
              <Shield size={22} color="#16a34a" />
            </div>
            <div>
              <h4>Secure Payment</h4>
              <p>100% safe transactions</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-item-icon trust-icon-orange">
              <RefreshCw size={22} color="#ea580c" />
            </div>
            <div>
              <h4>Easy Returns</h4>
              <p>7-day return policy</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-item-icon trust-icon-red">
              <Headphones size={22} color="#dc2626" />
            </div>
            <div>
              <h4>24/7 Support</h4>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      {categories.length > 0 && (
        <section className="categories-section section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Shop by Category</h2>
              <Link to="/products" className="section-link">View All <ArrowRight size={14} /></Link>
            </div>
            <div className="categories-grid">
              {categories.map(cat => (
                <Link to={`/category/${cat._id}`} key={cat._id} className="category-card">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="category-card-img" />
                  ) : (
                    <div className="category-card-placeholder">
                      <Package size={36} color="#6366f1" />
                    </div>
                  )}
                  <div className="category-card-overlay">
                    <span className="category-card-name">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PROMO BANNER ===== */}
      <div className="container">
        <div className="promo-banner">
          <div className="promo-banner-content">
            <h2>🎉 Grand Sale is Live!</h2>
            <p>Exclusive deals on top brands — limited time only.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '1.25rem', background: 'white', color: '#6366f1', fontWeight: 700, borderRadius: '12px' }}>
              Grab Deals Now <ArrowRight size={16} />
            </Link>
          </div>
          <div className="promo-banner-badge">
            UP TO 60% OFF
            <small>On selected items</small>
          </div>
        </div>
      </div>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="products-section section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="section-link">See All <ArrowRight size={14} /></Link>
          </div>
          {loading ? (
            <div className="grid-cols-4">
              {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid-cols-4">
              {products.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🛍️</div>
              <h3>No products yet</h3>
              <p>Products will appear here once added by admin.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
