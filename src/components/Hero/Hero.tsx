import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <img src="./src/assets/images/banner_faydonk.png" alt="Banner" className="banner-image" />
        <div className="hero-overlay"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="profile-section">
            <div className="profile-picture">
              <img src="./src/assets/images/pfp_faydonk.png" alt="faydonK Profile" />
            </div>
            <div className="profile-text">
              <h1 className="hero-title">Hello, I'm faydonK!</h1>
              <p className="hero-description">
                Passionate junior developer creating some random stuff. 
                I like making apps with new tech
                and bringing creative ideas to life through code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;