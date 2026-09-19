import './Footer.css';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <Mail size={20} className="footer-icon" />
            <span>EmailAuth</span>
          </div>
          <p className="footer-tagline">Secure, seamless authentication for modern applications.</p>
        </div>
        <div className="footer-links">
          <div className="footer-group">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Security</a>
            <a href="#">Pricing</a>
          </div>
          <div className="footer-group">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-group">
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} EmailAuth Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
