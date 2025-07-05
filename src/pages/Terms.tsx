import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Terms.css';

const Terms: React.FC = () => {
  return (
    <>
      <Header />
      <div className="terms-page">
        <div style={{ height: '71px' }}></div>
        <div className="container">
          <div className="terms-content">
            <h1>Terms of Service</h1>
            
            <section>
              <h2>Hosting Information</h2>
              <p>
                This website is hosted on Vercel, a cloud platform for static sites and serverless functions.
                Vercel provides the infrastructure and content delivery network (CDN) for this portfolio.
              </p>
            </section>
            
            <section>
              <h2>Content</h2>
              <p>
                All content on this website, including but not limited to text, images, and code examples,
                is the property of FaydonK unless otherwise stated.
              </p>
            </section>
            
            <section>
              <h2>Privacy</h2>
              <p>
                This website does not collect personal information. Any analytics or tracking
                is handled by Vercel's standard hosting services.
              </p>
            </section>
            
            <section>
              <h2>Contact</h2>
              <p>
                For any questions regarding these terms, please contact through the provided
                channels on the main website.
              </p>
            </section>
            
            <a href="/" className="back-link">← Back to Home</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;