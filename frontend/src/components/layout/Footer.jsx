import { Link } from 'react-router-dom';
import { ChevronRight, Apple, Play } from 'lucide-react';
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
        addToast('Successfully subscribed! Use code LUMEN10 for 10% off.', 'success');
        emailInput.value = '';
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to subscribe';
        if (errorMsg === 'You are already subscribed!') {
          addToast('Already subscribed! Your code is LUMEN10', 'success');
        } else {
          addToast(errorMsg, 'error');
        }
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
            <a href="#" className="app-badge" onClick={(e) => e.preventDefault()}>
              <Play size={20} className="app-icon" />
              <div className="app-badge-text">
                <span>GET IT ON</span>
                <strong>Google Play</strong>
              </div>
            </a>
            <a href="#" className="app-badge" onClick={(e) => e.preventDefault()}>
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
            <a href="#" className="app-badge" onClick={(e) => e.preventDefault()}>
              <Play size={20} className="app-icon" />
              <div className="app-badge-text">
                <span>GET IT ON</span>
                <strong>Google Play</strong>
              </div>
            </a>
            <a href="#" className="app-badge" onClick={(e) => e.preventDefault()}>
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
          By entering your email address you will be opted in to receive communications from LUMEN. For full details on how we use your information, view our <a href="#" onClick={(e) => e.preventDefault()}>privacy policy</a>.
        </p>

        <div className="footer-social-center">
          <a href="#" aria-label="Instagram" onClick={(e) => e.preventDefault()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          <a href="#" aria-label="Facebook" onClick={(e) => e.preventDefault()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="#" aria-label="Twitter" onClick={(e) => e.preventDefault()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          </a>
          <a href="#" aria-label="YouTube" onClick={(e) => e.preventDefault()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
          </a>
        </div>

        <Link to="/stores" className="btn-find-store">FIND YOUR NEAREST STORE</Link>
      </div>

      {/* Links Row */}
      <div className="footer-links-row">
        <Link to="/contact">Contact Us</Link>
        <Link to="/track-order">Track my Order</Link>
        <Link to="/size-guide">Size Guides</Link>
        <Link to="/delivery-returns">Delivery and Returns Info</Link>
        <Link to="/payment-methods">Payment Methods</Link>
        <Link to="/cookie-settings">Cookie Settings</Link>
        <Link to="/corporate">Corporate</Link>
        <Link to="/student-discount">Student Discount</Link>
        <Link to="/terms">Terms & Conditions</Link>
        <Link to="/gift-cards">Gift Cards</Link>
        <Link to="/faqs">FAQs</Link>
      </div>

      {/* Guarantee Section (Replacing Deliver To) */}
      <div className="footer-guarantee">
        <span className="guarantee-label">Why Choose LUMEN?</span>
        <p className="guarantee-text">Premium materials. Ethical manufacturing. Free worldwide shipping on all orders over ₹500.</p>
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
          <Link to="/faqs">FAQs</Link>
          <Link to="/accessibility">Accessibility</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/cookie-policy">Cookies</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
