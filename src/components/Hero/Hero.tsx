import React from 'react';
import ShaderGradientBackground from '../../three/ShaderGradientBackground';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <ShaderGradientBackground />
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="profile-text fade-in-up">
            <h1 className="hero-title">faydonK</h1>
            <p className="hero-description">
              French passionate junior developer creating some random stuff.
              I like making apps with new tech
              and bringing creative ideas to life through code
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;