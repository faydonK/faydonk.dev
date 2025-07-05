import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './404.css';

const NotFound: React.FC = () => {
  return (
    <>
      <Header />
      <div className="not-found-page">
        <div style={{ height: '71px' }}></div>
        <section id="card">
          <h1>404</h1>
          <p className="error-message">Page Not Found</p>
          <p><a href="/">Return Home</a></p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;