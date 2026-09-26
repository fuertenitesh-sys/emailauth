import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentPage = Number(searchParams.get('page') || 1);

  useEffect(() => {
    axios.get('/api/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentCategory) params.set('category', currentCategory);
        if (currentSearch) params.set('search', currentSearch);
        if (currentSort) params.set('sort', currentSort);
        params.set('page', currentPage);
        params.set('limit', 12);
        const res = await axios.get(`/api/products?${params}`);
        setProducts(res.data.products || []);
        setTotalPages(res.data.pages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategory, currentSearch, currentSort, currentPage]);

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value);
    else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = currentCategory || currentSearch || currentSort;

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <div>
            <h1 className="products-title">All Products</h1>
            {currentSearch && <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Results for "{currentSearch}"</p>}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className={`products-sidebar ${showFilters ? 'sidebar-open' : ''}`}>
            <div className="sidebar-section">
              <h3 className="sidebar-title">Categories</h3>
              <div className="sidebar-options">
                <button
                  className={`sidebar-option ${!currentCategory ? 'active' : ''}`}
                  onClick={() => updateFilter('category', '')}
                >All Categories</button>
                {categories.map(cat => (
                  <button
                    key={cat._id}
                    className={`sidebar-option ${currentCategory === cat._id ? 'active' : ''}`}
                    onClick={() => updateFilter('category', cat._id)}
                  >{cat.name}</button>
                ))}
              </div>
            </div>
            <div className="sidebar-section">
              <h3 className="sidebar-title">Sort By</h3>
              <div className="sidebar-options">
                {[['', 'Newest'], ['price_asc', 'Price: Low to High'], ['price_desc', 'Price: High to Low'], ['name_asc', 'Name A-Z']].map(([val, label]) => (
                  <button
                    key={val}
                    className={`sidebar-option ${currentSort === val ? 'active' : ''}`}
                    onClick={() => updateFilter('sort', val)}
                  >{label}</button>
                ))}
              </div>
            </div>
            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ width: '100%', marginTop: '1rem' }}>
                <X size={14} /> Clear All Filters
              </button>
            )}
          </aside>

          {/* Products Grid */}
          <div className="products-main">
            {loading ? (
              <div className="grid-cols-3">
                {Array(12).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid-cols-3">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                {totalPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => updateFilter('page', page)}
                      >{page}</button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
