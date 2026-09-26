import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
          axios.get('/api/products?limit=4')
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
      {/* ===== EDITORIAL HERO ===== */}
      <section className="hero-section">
        <div className="hero-background">
          {/* A clean solid background to replace the messy placeholder */}
          <div className="hero-image-placeholder" style={{ backgroundColor: '#f4f4f5' }}>
          </div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">THE NEW ESSENTIALS</h1>
          <p className="hero-subtitle">Refined silhouettes for the modern wardrobe.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">EXPLORE COLLECTION</Link>
          </div>
        </div>
      </section>

      {/* ===== STATEMENT SECTION ===== */}
      <section className="statement-section">
        <div className="container">
          <h2 className="statement-text">
            "Design is not just what it looks like and feels like. Design is how it works."
          </h2>
          <p className="statement-subtext">— LUMEN STUDIO</p>
        </div>
      </section>

      {/* ===== FEATURED CATEGORIES ===== */}
      {categories.length > 0 && (
        <section className="categories-section">
          <div className="categories-header container">
            <h2 className="section-title">SHOP BY CATEGORY</h2>
            <Link to="/products" className="view-all-link">VIEW ALL</Link>
          </div>
          <div className="categories-grid container">
            {categories.slice(0, 3).map(cat => (
              <Link to={`/category/${cat._id}`} key={cat._id} className="category-card">
                <div className="category-image-wrapper">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="category-image" />
                  ) : (
                    <div className="category-placeholder">LUMEN</div>
                  )}
                </div>
                <div className="category-info">
                  <h3 className="category-name">{cat.name}</h3>
                  <span className="category-link-text">SHOP NOW</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== LATEST ARRIVALS ===== */}
      <section className="products-section">
        <div className="products-header container">
          <h2 className="section-title">LATEST ARRIVALS</h2>
          <Link to="/products" className="view-all-link">SHOP ALL</Link>
        </div>
        <div className="container">
          {loading ? (
            <div className="grid-cols-4">
              {Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid-cols-4">
              {products.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : (
            <div className="empty-state">
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== EDITORIAL BLOCK ===== */}
      <section className="editorial-block">
        <div className="editorial-content">
          <div className="editorial-text-wrap">
            <h2 className="editorial-title">THE ARCHIVE COLLECTION</h2>
            <p className="editorial-desc">
              Discover our curated selection of timeless pieces. Built with uncompromising quality and designed to last a lifetime.
            </p>
            <Link to="/products" className="btn btn-outline">DISCOVER MORE</Link>
          </div>
        </div>
        <div className="editorial-image-wrap">
          <div className="editorial-placeholder">ARCHIVE</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
