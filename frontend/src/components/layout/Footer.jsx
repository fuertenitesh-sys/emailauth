import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, ChevronRight, Apple, Play } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import './Footer.css';

const Footer = () => {
  const { addToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
      try {
        await axios.post('/api/subscribers', { email: emailInput.value });
        addToast('Successfully subscribed to LUMEN!', 'success');
        emailInput.value = '';
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to subscribe', 'error');
      }
    }
  };

  return (
    <footer className="footer-premium">
      {/* Top App Badges Row */}
      <div className="footer-apps-row">
        <div className="footer-app-col">
          <h3>?app</h3>
          <div className="app-badges">
            <a href="#" className="app-badge">
              <Play size={20} className="app-icon" />
              <div className="app-badge-text">
                <span>GET IT ON</span>
                <strong>Google Play</strong>
              </div>
            </a>
            <a href="#" className="app-badge">
              <Apple size={20} className="app-icon" />
              <div className="app-badge-text">
                <span>Download on the</span>
                <strong>App Store</strong>
              </div>
            </a>
          </div>
        </div>
        <div className="footer-app-col">
          <h3>?launches</h3>
          <div className="app-badges">
            <a href="#" className="app-badge">
              <Play size={20} className="app-icon" />
              <div className="app-badge-text">
                <span>GET IT ON</span>
                <strong>Google Play</strong>
              </div>
            </a>
            <a href="#" className="app-badge">
              <Apple size={20} className="app-icon" />
              <div className="app-badge-text">
                <span>Download on the</span>
                <strong>App Store</strong>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Newsletter & Social */}
      <div className="footer-center-section">
        <h2>Sign up to get 10% off*</h2>
        <form className="newsletter-form-minimal" onSubmit={handleSubscribe}>
          <input type="email" placeholder="Enter your email here" required />
          <button type="submit"><ChevronRight size={18} /></button>
        </form>
        <p className="newsletter-disclaimer">
          By entering your email address you will be opted in to receive communications from LUMEN. For full details on how we use your information, view our <Link to="#">privacy policy</Link>.
        </p>

        <div className="footer-social-center">
          <a href="#" aria-label="Instagram"><Instagram size={24} /></a>
          <a href="#" aria-label="Facebook"><Facebook size={24} /></a>
          <a href="#" aria-label="Twitter"><Twitter size={24} /></a>
          <a href="#" aria-label="YouTube"><Youtube size={24} /></a>
        </div>

        <button className="btn-find-store">FIND YOUR NEAREST STORE</button>
      </div>

      {/* Links Row */}
      <div className="footer-links-row">
        <Link to="#">Contact Us</Link>
        <Link to="#">Track my Order</Link>
        <Link to="#">Size Guides</Link>
        <Link to="#">Delivery and Returns Info</Link>
        <Link to="#">Payment Methods</Link>
        <Link to="#">Cookie Settings</Link>
        <Link to="#">Corporate</Link>
        <Link to="#">Student Discount</Link>
        <Link to="#">Terms & Conditions</Link>
        <Link to="#">Gift Cards</Link>
        <Link to="#">FAQs</Link>
      </div>

      {/* Deliver To */}
      <div className="footer-deliver-to">
        <span className="deliver-label">Deliver To</span>
        <div className="deliver-select-wrapper">
          <img src="https://flagcdn.com/w20/gb.png" alt="UK Flag" className="deliver-flag" />
          <select className="deliver-select">
            <option>UNITED KINGDOM</option>
            <option>UNITED STATES</option>
            <option>INDIA</option>
          </select>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="footer-bottom-row">
        <div className="footer-bottom-left">
          <p className="copyright">Copyright &copy; {new Date().getFullYear()} LUMEN Fashion Plc. All rights reserved.</p>
          <div className="payment-icons">
            <span className="pay-badge">VISA</span>
            <span className="pay-badge">MasterCard</span>
            <span className="pay-badge">PayPal</span>
            <span className="pay-badge">Klarna</span>
          </div>
        </div>
        <div className="footer-bottom-right">
          <Link to="#">FAQs</Link>
          <Link to="#">Accessibility</Link>
          <Link to="#">Terms & Conditions</Link>
          <Link to="#">Cookies</Link>
          <Link to="#">Privacy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
