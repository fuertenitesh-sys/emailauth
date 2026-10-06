import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="footer-newsletter-wrapper">
        <div className="container footer-newsletter">
          <div className="newsletter-info">
            <h3>Join the LUMEN Club</h3>
            <p>Subscribe for exclusive access to new drops, special offers, and events.</p>
          </div>
          <form className="newsletter-form-footer" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="container footer-main">
        {/* Brand Col */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-brand">LUMEN</Link>
          <p className="footer-desc">
            Redefining modern essentials with uncompromising quality and timeless design.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Twitter">TW</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Youtube">YT</a>
          </div>
        </div>

        {/* Links Cols */}
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=men">Men's Collection</Link>
          <Link to="/products?category=women">Women's Collection</Link>
          <Link to="/products?category=accessories">Accessories</Link>
          <Link to="/products?sort=newest">New Arrivals</Link>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <Link to="#">Help Center</Link>
          <Link to="#">Track Order</Link>
          <Link to="#">Shipping Info</Link>
          <Link to="#">Returns & Exchanges</Link>
          <Link to="#">Contact Us</Link>
        </div>

        {/* Contact Col */}
        <div className="footer-col contact-col">
          <h4>Contact</h4>
          <div className="contact-item">
            <Mail size={16} />
            <a href="mailto:hello@lumen.com">hello@lumen.com</a>
          </div>
          <div className="contact-item">
            <Phone size={16} />
            <a href="tel:+919876543210">+91 98765 43210</a>
          </div>
          <div className="contact-item align-start">
            <MapPin size={16} />
            <span>123 Fashion Street, Tech Park,<br />Mumbai 400001, India</span>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="footer-bottom-inner">
          <p className="copyright">&copy; {new Date().getFullYear()} LUMEN. All rights reserved.</p>
          <div className="legal-links">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Cookie Policy</Link>
          </div>
          <div className="payment-methods">
            <span className="trust-badge-mini">100% SECURE CHECKOUT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
