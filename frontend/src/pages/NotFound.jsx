import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-number">404</div>
        <div className="notfound-divider" />
        <div className="notfound-text">
          <h1>Page Not Found</h1>
          <p>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="notfound-actions">
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
            <Link to="/" className="btn btn-outline">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
