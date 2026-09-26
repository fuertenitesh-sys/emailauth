import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-newsletter">
          <h3>Sign up for LUMEN updates</h3>
          <p>Receive exclusive access to new arrivals, limited releases, and special events.</p>
          <form className="footer-form">
            <input type="email" placeholder="EMAIL ADDRESS" required />
            <button type="submit">SUBSCRIBE</button>
          </form>
        </div>
      </div>

      <div className="container footer-links-section">
        <div className="footer-col">
          <h4>ABOUT</h4>
          <Link to="#">Our Story</Link>
          <Link to="#">Locations</Link>
          <Link to="#">Careers</Link>
        </div>
        <div className="footer-col">
          <h4>SUPPORT</h4>
          <Link to="#">FAQ</Link>
          <Link to="#">Shipping & Returns</Link>
          <Link to="#">Contact Us</Link>
        </div>
        <div className="footer-col">
          <h4>LEGAL</h4>
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
          <Link to="#">Accessibility</Link>
        </div>
        <div className="footer-col footer-social">
          <h4>SOCIAL</h4>
          <Link to="#">Instagram</Link>
          <Link to="#">Twitter</Link>
          <Link to="#">YouTube</Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} LUMEN. All rights reserved.</p>
        <div className="footer-brand-large">LUMEN</div>
      </div>
    </footer>
  );
};

export default Footer;
