import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Minus, Plus, Tag, Package, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ui/ProductCard';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const initialProduct = location.state?.product || null;
  const [product, setProduct] = useState(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(!initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    if (!product) setLoading(true);
    setActiveImage(0);
    axios.get(`/api/products/${id}`)
      .then(async res => {
        setProduct(res.data);
        // Fetch related products from same category
        if (res.data.category?._id) {
          try {
            const catRes = await axios.get(`/api/products?limit=1000`);
            const allProds = catRes.data.products || catRes.data || [];
            const related = allProds.filter(p =>
              p.category?._id === res.data.category._id && p._id !== id
            ).slice(0, 4);
            setRelatedProducts(related);
          } catch (_) {}
        }
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader"><div className="loading-spinner" /></div>;
  if (!product) return null;

  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async (buyNow = false) => {
    if (buyNow) setBuying(true);
    else setAdding(true);
    try {
      if (buyNow) {
        sessionStorage.setItem('directBuyItem', JSON.stringify({ product, quantity }));
        navigate('/checkout', { state: { directBuyItem: { product, quantity } } });
      } else {
        await addToCart(product._id, quantity);
        addToast(`${product.name} added to cart!`, 'success');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        addToast('Please login to add items to cart', 'warning');
        navigate('/login');
      } else {
        addToast(err.response?.data?.message || 'Failed to add to cart', 'error');
      }
    } finally {
      setAdding(false);
      setBuying(false);
    }
  };

  return (
    <div className={`product-detail-page ${initialProduct ? 'fade-in' : ''}`}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="product-detail-breadcrumb">
          <Link to="/products">Products</Link>
          <ChevronRight size={14} />
          {product.category?.name && (
            <>
              <Link to={`/products?category=${product.category.name.toLowerCase()}`}>
                {product.category.name}
              </Link>
              <ChevronRight size={14} />
            </>
          )}
          <span>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* Images */}
          <div className="product-detail-images">
            <div className="product-detail-main-image">
              {product.images?.[activeImage] ? (
                <img src={product.images[activeImage]} alt={product.name} />
              ) : (
                <div className="product-detail-placeholder"><Package size={60} style={{ color: 'var(--color-border)' }} /></div>
              )}
              {product.discount > 0 && (
                <span className="product-detail-discount-badge">−{product.discount}%</span>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="product-detail-thumbnails">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className={`product-detail-thumb ${activeImage === i ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            {product.category?.name && (
              <Link
                to={`/products?category=${product.category.name.toLowerCase()}`}
                className="product-detail-category"
              >
                <Tag size={12} /> {product.category.name}
              </Link>
            )}

            <h1 className="product-detail-name">{product.name}</h1>

            <div className="product-detail-price-area">
              <span className="price-discounted">₹{discountedPrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <>
                  <span className="price-original">₹{product.price.toFixed(2)}</span>
                  <span className="product-discount-pill">−{product.discount}% OFF</span>
                </>
              )}
            </div>

            <p className="product-detail-desc">{product.description}</p>

            <div className="product-detail-stock">
              <div className={`stock-indicator ${isOutOfStock ? 'out' : product.stock < 5 ? 'low' : 'in'}`} />
              {isOutOfStock ? (
                <span className="stock-text out">Out of Stock</span>
              ) : product.stock < 5 ? (
                <span className="stock-text low">Only {product.stock} left in stock!</span>
              ) : (
                <span className="stock-text in">{product.stock} in stock</span>
              )}
            </div>

            {!isOutOfStock && (
              <div className="product-detail-qty">
                <span className="qty-label">Quantity</span>
                <div className="qty-controls">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    className="qty-btn"
                    disabled={quantity <= 1}
                  ><Minus size={16} /></button>
                  <span className="qty-value">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} 
                    className="qty-btn"
                    disabled={quantity >= product.stock}
                  ><Plus size={16} /></button>
                </div>
              </div>
            )}

            <div className="product-detail-actions">
              <button
                className="btn btn-outline btn-lg"
                onClick={() => handleAddToCart(false)}
                disabled={adding || buying || isOutOfStock}
                style={{ flex: 1 }}
              >
                <ShoppingCart size={18} />
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => handleAddToCart(true)}
                disabled={adding || buying || isOutOfStock}
                style={{ flex: 1 }}
              >
                {buying ? 'Processing...' : 'Buy Now'}
              </button>
            </div>

            {/* Delivery info */}
            <div className="product-delivery-info">
              <div className="delivery-info-row">
                <span className="delivery-label">Delivery</span>
                <span>Free shipping on orders above ₹500</span>
              </div>
              <div className="delivery-info-row">
                <span className="delivery-label">Returns</span>
                <span>30-day easy returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <div className="related-products-header">
              <h2>You May Also Like</h2>
              {product.category?.name && (
                <Link to={`/products?category=${product.category.name.toLowerCase()}`} className="view-all-link">
                  View All →
                </Link>
              )}
            </div>
            <div className="grid-cols-4">
              {relatedProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
