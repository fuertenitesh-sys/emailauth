import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [catsRes, prodsRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/products')
        ]);
        setCategories(catsRes.data);
        const fetchedProducts = prodsRes.data.products || prodsRes.data || [];
        setAllProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category?.name?.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    
    setProducts(filtered);
  }, [allProducts, selectedCategory, searchQuery]);

  return (
    <div className="collections-page">
      <div className="collection-header">
        <h1 className="collection-title">
          {searchQuery 
            ? `SEARCH: ${searchQuery.toUpperCase()}` 
            : (selectedCategory && categories.length > 0 
                ? (categories.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase())?.name?.toUpperCase() || selectedCategory.toUpperCase())
                : 'ALL PRODUCTS')}
        </h1>
        <p className="collection-count">{loading ? '-' : products.length} ITEMS</p>
      </div>

      <div className="container collections-container">
        {/* Filters Sidebar */}
        <div className="collections-filters">
          <div className="filter-group">
            <h3 className="filter-title">CATEGORIES</h3>
            <div className="filter-options">
              <button 
                className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory('');
                  navigate('/products', { replace: true });
                }}
              >
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat._id}
                  className={`filter-btn ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat.name.toLowerCase());
                    navigate(`/products?category=${cat.name.toLowerCase()}`, { replace: true });
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <h3 className="filter-title">SORT BY</h3>
            <div className="filter-options">
              <button className="filter-btn active">Featured</button>
              <button className="filter-btn">Newest</button>
              <button className="filter-btn">Price: High-Low</button>
              <button className="filter-btn">Price: Low-High</button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="collections-grid-wrap">
          {loading ? (
            <div className="grid-cols-3">
              {Array(6).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid-cols-3">
              {products.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : (
            <div className="empty-state">
              <h3>NO RESULTS FOUND</h3>
              <p>We couldn't find any products matching your criteria.</p>
              <button className="btn btn-outline" onClick={() => {setSelectedCategory(''); window.location.href='/products';}}>
                CLEAR FILTERS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
