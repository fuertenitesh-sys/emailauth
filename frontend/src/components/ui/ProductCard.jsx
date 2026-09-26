import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const showToast = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock > 0) {
      addToCart(product);
      showToast('Added to cart');
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const hasDiscount = product.discount > 0;
  const originalPrice = product.price;
  const finalPrice = hasDiscount ? originalPrice - (originalPrice * (product.discount / 100)) : originalPrice;

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-card-image-wrapper">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="product-card-image" />
        ) : (
          <div className="product-card-placeholder">
            <span>LUMEN</span>
          </div>
        )}
        
        {hasDiscount && (
          <div className="product-card-badge">-{product.discount}%</div>
        )}
        
        {product.stock <= 0 && (
          <div className="product-card-overlay">SOLD OUT</div>
        )}

        <div className="product-card-quick-add">
          <button 
            className="btn btn-primary btn-full btn-sm"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'QUICK ADD' : 'SOLD OUT'}
          </button>
        </div>
      </div>
      
      <div className="product-card-body">
        <div className="product-card-brand">LUMEN</div>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-price">
          {hasDiscount ? (
            <>
              <span className="price-final">₹{finalPrice.toFixed(0)}</span>
              <span className="price-original">₹{originalPrice.toFixed(0)}</span>
            </>
          ) : (
            <span className="price-final">₹{finalPrice.toFixed(0)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
