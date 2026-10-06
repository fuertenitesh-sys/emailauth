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
            <a href="#" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" aria-label="Youtube">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
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
