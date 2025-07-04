import React from 'react';
import './404.css';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-page">
      <section id="card">
        <h1>404</h1>
        <p><a href="/">Return Home</a></p>
      </section>
    </div>
  );
};

export default NotFound;