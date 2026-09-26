import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [adding, setAdding] = useState(false);

  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    setAdding(true);
    try {
      await addToCart(product._id, 1);
      addToast(`${product.name} added to cart!`, 'success');
    } catch (err) {
      if (err.response?.status === 401) {
        addToast('Please login to add items to cart', 'warning');
      } else {
        addToast(err.response?.data?.message || 'Failed to add to cart', 'error');
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card card card-hover">
      <Link to={`/products/${product._id}`} className="product-card-image-wrapper">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="product-card-image" loading="lazy" />
        ) : (
          <div className="product-card-placeholder">
            <ShoppingCart size={40} style={{ color: 'var(--color-border)' }} />
          </div>
        )}
        {product.discount > 0 && (
          <span className="product-card-discount-badge">{product.discount}% OFF</span>
        )}
        {isOutOfStock && <span className="product-card-out-of-stock">Out of Stock</span>}
      </Link>
      <div className="product-card-body">
        {product.category?.name && (
          <span className="product-card-category">{product.category.name}</span>
        )}
        <Link to={`/products/${product._id}`}>
          <h3 className="product-card-name">{product.name}</h3>
        </Link>
        <div className="product-card-price">
          <span className="price price-discounted">₹{discountedPrice.toFixed(2)}</span>
          {product.discount > 0 && (
            <span className="price-original">₹{product.price.toFixed(2)}</span>
          )}
        </div>
        <div className="product-card-actions">
          <button
            className="btn btn-primary btn-sm product-card-btn"
            onClick={handleAddToCart}
            disabled={adding || isOutOfStock}
          >
            <ShoppingCart size={14} />
            {adding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <Link to={`/products/${product._id}`} className="btn btn-ghost btn-sm product-card-view-btn">
            <Eye size={14} /> View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
