import React, { useEffect, useRef, useState } from 'react';
import './About.css';

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  return (
    <section id="about" className="about" ref={aboutRef}>
      <div className="container">
        <div className={`about-content ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="about-title">About</h2>
          <div className="about-text">
            <p>
              I started to get interested in Dev at the age of 16 years old, I wanted to start by creating bots discord, after that I saw that it was not as simple as I thought 😅, 
              so I moved to Web development, I started, then I quickly stopped.

            </p>
            <p>
              Since the arrival of AI, I've understood that it's a very powerful tool for learning, and to get where I am, I'd NEVER HAVE ARRIVED SO FAST WITHOUT IT.
              And thanks to it, I've quickly become paterfamilias, and seeing ideas in my head come to life gives me a dose of adrenalin...
            </p>
            <p>
              Today I continue to do my projects in my corner, I sometimes hesitate to launch into freelancing to do other people's projects, 
              but I always block myself because I have the studies.
            </p>
            <p className="ps">ps: I still use AI for help me 👀</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;