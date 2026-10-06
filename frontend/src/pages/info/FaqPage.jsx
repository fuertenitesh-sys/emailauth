import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './InfoPages.css';

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      q: 'How long does shipping take?',
      a: 'Standard shipping takes 3-5 business days. Express shipping is available at checkout for 1-2 business day delivery. International orders may take 7-14 days depending on customs.'
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 30-day return policy for all unworn, unwashed items in their original packaging with tags attached. Refunds are processed back to the original payment method within 5-7 business days of receiving the return.'
    },
    {
      q: 'Do you ship internationally?',
      a: 'Yes, we ship to over 100 countries worldwide. International shipping costs are calculated at checkout based on destination and weight.'
    },
    {
      q: 'How do I track my order?',
      a: 'Once your order ships, you will receive a confirmation email with a tracking link. You can also use the "Track Order" link in our footer using your order number and email address.'
    },
    {
      q: 'Are your materials ethically sourced?',
      a: 'Yes, sustainability and ethical manufacturing are at the core of LUMEN. We partner exclusively with certified factories and prioritize organic and recycled materials whenever possible.'
    }
  ];

  return (
    <div className="info-page-container">
      <div className="info-content-wrapper">
        <h1 className="info-title">Frequently Asked Questions</h1>
        <p className="info-subtitle">Find answers to common questions about shipping, returns, and our products.</p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button className="faq-question" onClick={() => setOpenIndex(index === openIndex ? -1 : index)}>
                {faq.q}
                {index === openIndex ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {index === openIndex && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
