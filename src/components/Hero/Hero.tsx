import React from 'react';
import pfpLogo from '../../assets/images/pfp_faydonk.png';
import bannerLogo from '../../assets/images/banner_faydonk.png';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <img src={bannerLogo} alt="Banner" className="banner-image" />
        <div className="hero-overlay"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="profile-section">
            <div className="profile-picture">
              <img src={pfpLogo} alt="faydonK Profile" />
            </div>
            <div className="profile-text">
              <h1 className="hero-title">Hello, I'm faydonK!</h1>
              <p className="hero-description">
                French passionate junior developer creating some random stuff. 
                I like making apps with new tech
                and bringing creative ideas to life through code
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;