import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { ArrowRight, TrendingUp, Star } from 'lucide-react';
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
          axios.get('/api/products?limit=8&sort=newest')
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

      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="hero-bg-gradient" />
        <div className="hero-content">
          <div className="hero-eyebrow">New Collection — 2026</div>
          <h1 className="hero-title">THE NEW<br />ESSENTIALS</h1>
          <p className="hero-subtitle">
            Curated products for the modern lifestyle.
            <br />Quality you can trust. Style you'll love.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="hero-btn-primary">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="hero-btn-secondary">
              View All Categories
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">500+</span>
              <span className="hero-stat-label">Products</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-number">50K+</span>
              <span className="hero-stat-label">Happy Customers</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-number">4.9★</span>
              <span className="hero-stat-label">Avg Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-scroll-hint">Scroll to explore ↓</div>
      </section>

      {/* ===== FEATURES STRIP ===== */}
      <section className="features-strip">
        <div className="container features-strip-inner">
          <div className="feature-item">
            <span className="feature-icon">🚚</span>
            <div>
              <strong>Free Shipping</strong>
              <span>On orders above ₹500</span>
            </div>
          </div>
          <div className="feature-divider" />
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <div>
              <strong>Easy Returns</strong>
              <span>30-day hassle-free returns</span>
            </div>
          </div>
          <div className="feature-divider" />
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <div>
              <strong>Secure Payments</strong>
              <span>100% protected checkout</span>
            </div>
          </div>
          <div className="feature-divider" />
          <div className="feature-item">
            <span className="feature-icon">🎧</span>
            <div>
              <strong>24/7 Support</strong>
              <span>Always here to help</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      {categories.length > 0 && (
        <section className="categories-section">
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Browse</p>
                <h2 className="section-title">SHOP BY CATEGORY</h2>
              </div>
              <Link to="/products" className="view-all-link">View All <ArrowRight size={14} /></Link>
            </div>
            <div className="categories-grid">
              {categories.slice(0, 4).map((cat, i) => (
                <Link
                  to={`/products?category=${cat.name.toLowerCase()}`}
                  key={cat._id}
                  className={`category-card ${i === 0 ? 'category-card-featured' : ''}`}
                >
                  <div className="category-image-wrapper">
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} className="category-image" />
                    ) : (
                      <div className="category-placeholder">
                        <span>{cat.name[0]}</span>
                      </div>
                    )}
                    <div className="category-overlay" />
                  </div>
                  <div className="category-info">
                    <h3 className="category-name">{cat.name}</h3>
                    <span className="category-link-text">Shop Now →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== LATEST ARRIVALS ===== */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Fresh Picks</p>
              <h2 className="section-title">LATEST ARRIVALS</h2>
            </div>
            <Link to="/products?sort=newest" className="view-all-link">Shop All <ArrowRight size={14} /></Link>
          </div>
          {loading ? (
            <div className="grid-cols-4">
              {Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid-cols-4">
              {products.slice(0, 4).map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : (
            <div className="empty-state">
              <p>No products available at the moment.</p>
            </div>
          )}
          {products.length > 4 && (
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/products" className="btn btn-outline">View All Products</Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== EDITORIAL BLOCK ===== */}
      <section className="editorial-block">
        <div className="editorial-content">
          <div className="editorial-text-wrap">
            <p className="editorial-eyebrow">Curated For You</p>
            <h2 className="editorial-title">THE PREMIUM<br />COLLECTION</h2>
            <p className="editorial-desc">
              Discover our handpicked selection of premium products. 
              Built with uncompromising quality, designed to last a lifetime.
            </p>
            <Link to="/products" className="editorial-cta">
              Discover More <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="editorial-visual">
          <div className="editorial-visual-inner">
            <div className="editorial-floating-card">
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span>4.9/5 from 12,000+ reviews</span>
            </div>
            <div className="editorial-visual-text">LUMEN</div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="newsletter-section">
        <div className="container newsletter-inner">
          <div className="newsletter-text">
            <h2>Stay in the Loop</h2>
            <p>Get exclusive deals, new arrivals and offers directly to your inbox.</p>
          </div>
          <form className="newsletter-form" onSubmit={e => { e.preventDefault(); }}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
