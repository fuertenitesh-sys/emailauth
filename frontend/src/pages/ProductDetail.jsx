import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Minus, Plus, Tag, Package, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader"><div className="loading-spinner" /></div>;
  if (!product) return null;

  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async (buyNow = false) => {
    setAdding(true);
    try {
      await addToCart(product._id, quantity);
      addToast(`${product.name} added to cart!`, 'success');
      if (buyNow) navigate('/cart');
    } catch (err) {
      if (err.response?.status === 401) {
        addToast('Please login to add items to cart', 'warning');
        navigate('/login');
      } else {
        addToast(err.response?.data?.message || 'Failed to add to cart', 'error');
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/products" className="back-link"><ArrowLeft size={16} /> Back to Products</Link>
        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-images">
            <div className="product-detail-main-image">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} />
              ) : (
                <div className="product-detail-placeholder"><Package size={60} style={{ color: 'var(--color-border)' }} /></div>
              )}
              {product.discount > 0 && <span className="product-detail-discount-badge">{product.discount}% OFF</span>}
            </div>
            {product.images?.length > 1 && (
              <div className="product-detail-thumbnails">
                {product.images.map((img, i) => (
                  <img key={i} src={img} alt={`${product.name} ${i + 1}`} className="product-detail-thumb" />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            {product.category?.name && (
              <Link to={`/category/${product.category._id}`} className="product-detail-category">
                <Tag size={14} /> {product.category.name}
              </Link>
            )}
            <h1 className="product-detail-name">{product.name}</h1>

            <div className="product-detail-price-area">
              <span className="price price-discounted" style={{ fontSize: '2rem' }}>₹{discountedPrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <>
                  <span className="price-original">₹{product.price.toFixed(2)}</span>
                  <span className="discount-badge">{product.discount}% OFF</span>
                </>
              )}
            </div>

            <p className="product-detail-desc">{product.description}</p>

            <div className="product-detail-stock">
              <Package size={16} />
              {isOutOfStock ? (
                <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>Out of Stock</span>
              ) : (
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{product.stock} in stock</span>
              )}
            </div>

            {!isOutOfStock && (
              <div className="product-detail-qty">
                <span className="qty-label">Quantity</span>
                <div className="qty-controls">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="qty-btn"><Minus size={16} /></button>
                  <span className="qty-value">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="qty-btn"><Plus size={16} /></button>
                </div>
              </div>
            )}

            <div className="product-detail-actions">
              <button
                className="btn btn-outline btn-lg"
                onClick={() => handleAddToCart(false)}
                disabled={adding || isOutOfStock}
                style={{ flex: 1 }}
              >
                <ShoppingCart size={18} /> {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => handleAddToCart(true)}
                disabled={adding || isOutOfStock}
                style={{ flex: 1 }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
