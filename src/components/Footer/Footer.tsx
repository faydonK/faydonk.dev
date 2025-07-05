import React from 'react';
import { GithubIcon, TwitterIcon } from '../../assets/icons';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            faydonK
            <div className="footer-copyright">
              © 2025 All rights reserved
            </div>
          </div>
          <div className="footer-center">
            <a href="/terms" className="footer-link">Terms</a>
          </div>
          <div className="footer-social">
            <a href="https://github.com/faydonk" className="social-link" target="_blank" rel="noopener noreferrer">
              <GithubIcon size={45} />
            </a>
            <a href="https://twitter.com/faydonkwin" className="social-link" target="_blank" rel="noopener noreferrer">
              <TwitterIcon size={45} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;