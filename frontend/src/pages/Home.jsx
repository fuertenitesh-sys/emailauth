import { Link } from 'react-router-dom';
import { Shield, Zap, Lock } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">New: Passkey Support Available Now</div>
            <h1 className="hero-title">
              Authentication made <span className="text-gradient">simple</span> and secure.
            </h1>
            <p className="hero-subtitle">
              Integrate powerful, passwordless, and multi-factor authentication into your application in minutes. Built for modern teams.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
              <Link to="/login" className="btn btn-outline btn-lg">View Documentation</Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="mockup-card">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div className="mockup-body">
                <div className="mockup-icon"><Shield size={32} /></div>
                <h3>Secure Login</h3>
                <div className="mockup-input"></div>
                <div className="mockup-input"></div>
                <div className="mockup-btn"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-header">
            <h2>Everything you need for auth</h2>
            <p>We handle the complexity of authentication so you can focus on building your product.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Zap className="feature-icon" size={24} />
              </div>
              <h3>Lightning Fast</h3>
              <p>Optimized delivery ensures your users never wait on the authentication step. Global edge network included.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Lock className="feature-icon" size={24} />
              </div>
              <h3>Bank-grade Security</h3>
              <p>State of the art encryption, regular audits, and compliance with SOC2, GDPR, and HIPAA standards.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Shield className="feature-icon" size={24} />
              </div>
              <h3>Fraud Protection</h3>
              <p>Automatic detection and blocking of suspicious IPs, credential stuffing, and bot attacks.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
