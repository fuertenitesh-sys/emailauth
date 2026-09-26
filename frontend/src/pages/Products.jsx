import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';

  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/api/products';
        const params = [];
        if (searchQuery) params.push(`search=${searchQuery}`);
        if (selectedCategory) params.push(`category=${selectedCategory}`);
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }
        
        const res = await axios.get(url);
        // Assuming backend returns { products: [...] } for pagination or just array
        setProducts(res.data.products || res.data || []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="collections-page">
      <div className="collection-header">
        <h1 className="collection-title">
          {searchQuery ? `SEARCH: ${searchQuery.toUpperCase()}` : 'ALL PRODUCTS'}
        </h1>
        <p className="collection-count">{products.length} ITEMS</p>
      </div>

      <div className="container collections-container">
        {/* Filters Sidebar */}
        <div className="collections-filters">
          <div className="filter-group">
            <h3 className="filter-title">CATEGORIES</h3>
            <div className="filter-options">
              <button 
                className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat._id}
                  className={`filter-btn ${selectedCategory === cat._id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat._id)}
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
