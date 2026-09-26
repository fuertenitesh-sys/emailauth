import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
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
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-eyebrow">New Arrivals 2026</span>
            <h1 className="hero-title">Discover Premium<br />Products for Every<br />Lifestyle</h1>
            <p className="hero-subtitle">Shop the latest trends across Electronics, Fashion, Home & more. Quality guaranteed.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                <ShoppingBag size={18} /> Shop Now
              </Link>
              <Link to="/products" className="btn btn-outline btn-lg">Browse Categories</Link>
            </div>
          </div>
          <div className="hero-image-area">
            <div className="hero-image-placeholder">
              <ShoppingBag size={80} style={{ color: 'var(--color-primary-light)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="container trust-grid">
          <div className="trust-item">
            <Truck size={24} style={{ color: 'var(--color-primary)' }} />
            <div>
              <h4>Free Delivery</h4>
              <p>On orders above ₹500</p>
            </div>
          </div>
          <div className="trust-item">
            <Shield size={24} style={{ color: 'var(--color-success)' }} />
            <div>
              <h4>Secure Payment</h4>
              <p>100% safe transactions</p>
            </div>
          </div>
          <div className="trust-item">
            <RefreshCw size={24} style={{ color: 'var(--color-warning)' }} />
            <div>
              <h4>Easy Returns</h4>
              <p>7-day return policy</p>
            </div>
          </div>
          <div className="trust-item">
            <Headphones size={24} style={{ color: 'var(--color-danger)' }} />
            <div>
              <h4>24/7 Support</h4>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Shop by Category</h2>
              <Link to="/products" className="section-link">View All <ArrowRight size={16} /></Link>
            </div>
            <div className="categories-grid">
              {categories.map(cat => (
                <Link to={`/category/${cat._id}`} key={cat._id} className="category-card">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="category-card-img" />
                  ) : (
                    <div className="category-card-placeholder">
                      <ShoppingBag size={32} style={{ color: 'var(--color-primary)' }} />
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

      {/* Featured Products */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="section-link">See All <ArrowRight size={16} /></Link>
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
