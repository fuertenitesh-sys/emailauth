import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';

const CategoryProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`/api/products?category=${id}&limit=50`),
          axios.get('/api/categories')
        ]);
        setProducts(prodRes.data.products || []);
        const found = catRes.data.find(c => c._id === id);
        setCategory(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        <Link to="/products" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> All Products
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>
          {category ? category.name : 'Category'}
        </h1>
        {loading ? (
          <div className="grid-cols-4">
            {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid-cols-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No products in this category</h3>
            <p>Check back later for new arrivals.</p>
            <Link to="/products" className="btn btn-primary">Browse All Products</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
