import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './InfoPages.css';

const textData = {
  '/privacy': {
    title: 'Privacy Policy',
    content: (
      <>
        <p>Last updated: October 2026</p>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.</p>
        <h2>2. How We Use Information</h2>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send administrative messages, customer service responses, and technical notices</li>
          <li>Communicate about products, services, offers, and events</li>
        </ul>
        <h2>3. Data Security</h2>
        <p>LUMEN takes reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
      </>
    )
  },
  '/terms': {
    title: 'Terms & Conditions',
    content: (
      <>
        <p>Last updated: October 2026</p>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
        <h2>2. Use of Site</h2>
        <p>Harassment in any manner or form on the site, including via e-mail, chat, or by use of obscene or abusive language, is strictly forbidden. Impersonation of others, including a LUMEN or other licensed employee, host, or representative, as well as other members or visitors on the site is prohibited.</p>
      </>
    )
  },
  '/corporate': {
    title: 'Corporate Information',
    content: (
      <>
        <h2>About LUMEN Fashion Plc.</h2>
        <p>LUMEN is a global leader in premium lifestyle essentials, operating in over 50 countries. Founded in 2020, we have grown from a small studio to an international brand synonymous with quality and minimalist design.</p>
        <h2>Investor Relations</h2>
        <p>For investor inquiries, quarterly reports, and financial disclosures, please contact our Investor Relations department at investors@lumen.com.</p>
        <h2>Careers</h2>
        <p>We are always looking for passionate individuals to join our global team. View our current openings on our LinkedIn page.</p>
      </>
    )
  },
  '/cookie-policy': {
    title: 'Cookie Policy',
    content: (
      <>
        <h2>What Are Cookies?</h2>
        <p>Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to recognize your device and remember if you've been to the website before.</p>
        <h2>How We Use Cookies</h2>
        <ul>
          <li><strong>Essential Cookies:</strong> Necessary for the website to function properly (e.g., shopping cart, secure login).</li>
          <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
          <li><strong>Targeting Cookies:</strong> Used to deliver advertisements more relevant to you and your interests.</li>
        </ul>
      </>
    )
  },
  '/cookie-settings': {
    title: 'Cookie Settings',
    content: (
      <>
        <p>Manage your cookie preferences below.</p>
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
            <div>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Strictly Necessary Cookies</h3>
              <p style={{ fontSize: '0.85rem' }}>Required for the website to function. Cannot be switched off.</p>
            </div>
            <div style={{ color: '#4ade80', fontWeight: 'bold' }}>Always Active</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
            <div>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Performance Cookies</h3>
              <p style={{ fontSize: '0.85rem' }}>Allows us to count visits and traffic sources.</p>
            </div>
            <div>
              <label className="switch" style={{ cursor: 'pointer' }}><input type="checkbox" defaultChecked /> <span style={{ color: '#fff' }}>Enabled</span></label>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
            <div>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Targeting Cookies</h3>
              <p style={{ fontSize: '0.85rem' }}>Used by our advertising partners to build a profile of your interests.</p>
            </div>
            <div>
              <label className="switch" style={{ cursor: 'pointer' }}><input type="checkbox" /> <span style={{ color: '#fff' }}>Disabled</span></label>
            </div>
          </div>
          <button className="info-submit-btn" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>Save Preferences</button>
        </div>
      </>
    )
  },
  '/accessibility': {
    title: 'Accessibility Statement',
    content: (
      <>
        <h2>Our Commitment</h2>
        <p>LUMEN is committed to digital accessibility, ensuring that all people can access and use our website. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
        <h2>Conformance Status</h2>
        <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. LUMEN is partially conformant with WCAG 2.1 level AA.</p>
        <h2>Feedback</h2>
        <p>We welcome your feedback on the accessibility of LUMEN. Please let us know if you encounter accessibility barriers on our site by contacting us at accessibility@lumen.com.</p>
      </>
    )
  },
  '/delivery-returns': {
    title: 'Delivery & Returns',
    content: (
      <>
        <h2>Delivery Information</h2>
        <ul>
          <li><strong>Standard Delivery:</strong> 3-5 working days. Free on orders over $50.</li>
          <li><strong>Express Delivery:</strong> Next working day (if ordered before 2 PM). Costs $10.</li>
          <li><strong>International Delivery:</strong> 7-14 working days. Costs calculated at checkout.</li>
        </ul>
        <h2>Returns Policy</h2>
        <p>We accept returns within 30 days of delivery. Items must be unworn, unwashed, and have original tags attached.</p>
        <h3>How to Return</h3>
        <ol>
          <li style={{ marginBottom: '0.5rem' }}>Log in to your account and navigate to "Orders".</li>
          <li style={{ marginBottom: '0.5rem' }}>Select the item you wish to return and print the generated shipping label.</li>
          <li style={{ marginBottom: '0.5rem' }}>Drop off the package at your nearest designated courier location.</li>
        </ol>
        <p>Refunds will be processed within 5-7 business days after we receive your return.</p>
      </>
    )
  }
};

const LegalPages = () => {
  const location = useLocation();
  const pageData = textData[location.pathname] || { title: 'Information', content: <p>Information not found.</p> };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="info-page-container">
      <div className="info-content-wrapper">
        <h1 className="info-title">{pageData.title}</h1>
        <div className="legal-text-content">
          {pageData.content}
        </div>
      </div>
    </div>
  );
};

export default LegalPages;
