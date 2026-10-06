import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import './Products.css';

const SORT_OPTIONS = [
  { key: 'featured', label: 'Featured' },
  { key: 'newest', label: 'Newest First' },
  { key: 'price_asc', label: 'Price: Low to High' },
  { key: 'price_desc', label: 'Price: High to Low' },
  { key: 'name_asc', label: 'Name: A–Z' },
];

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortKey, setSortKey] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';

  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [catsRes, prodsRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/products?limit=1000')
        ]);
        setCategories(catsRes.data);
        const fetched = prodsRes.data.products || prodsRes.data || [];
        setAllProducts(fetched);
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
      filtered = filtered.filter(p =>
        p.category?.name?.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
    }

    // Apply sort
    switch (sortKey) {
      case 'price_asc':
        filtered.sort((a, b) => {
          const ap = a.price - (a.price * (a.discount || 0)) / 100;
          const bp = b.price - (b.price * (b.discount || 0)) / 100;
          return ap - bp;
        });
        break;
      case 'price_desc':
        filtered.sort((a, b) => {
          const ap = a.price - (a.price * (a.discount || 0)) / 100;
          const bp = b.price - (b.price * (b.discount || 0)) / 100;
          return bp - ap;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break; // featured = original order
    }

    setProducts(filtered);
  }, [allProducts, selectedCategory, searchQuery, sortKey]);

  const currentSortLabel = SORT_OPTIONS.find(o => o.key === sortKey)?.label || 'Featured';

  const pageTitle = searchQuery
    ? `Search: "${searchQuery}"`
    : selectedCategory && categories.length > 0
    ? categories.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase())?.name || selectedCategory
    : 'All Products';

  return (
    <div className="collections-page">
      <div className="collection-header">
        <h1 className="collection-title">{pageTitle.toUpperCase()}</h1>
        <p className="collection-count">
          {loading ? '–' : products.length} {products.length === 1 ? 'ITEM' : 'ITEMS'}
        </p>
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
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  className={`filter-btn ${sortKey === opt.key ? 'active' : ''}`}
                  onClick={() => setSortKey(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="collections-grid-wrap">
          {/* Mobile sort bar */}
          <div className="mobile-sort-bar">
            <span>{loading ? '–' : products.length} items</span>
            <div className="sort-dropdown-wrapper">
              <button className="sort-dropdown-btn" onClick={() => setSortOpen(p => !p)}>
                <SlidersHorizontal size={15} />
                {currentSortLabel}
                <ChevronDown size={14} />
              </button>
              {sortOpen && (
                <div className="sort-dropdown-menu">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.key}
                      className={`sort-dropdown-item ${sortKey === opt.key ? 'active' : ''}`}
                      onClick={() => { setSortKey(opt.key); setSortOpen(false); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="collections-grid-inner">
              {Array(6).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="collections-grid-inner">
              {products.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>NO RESULTS FOUND</h3>
              <p>We couldn't find any products matching your criteria.</p>
              <button
                className="btn btn-outline"
                onClick={() => { setSelectedCategory(''); setSortKey('featured'); navigate('/products', { replace: true }); }}
              >
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
