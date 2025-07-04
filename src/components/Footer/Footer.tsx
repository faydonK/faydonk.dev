import React from 'react';
import GitHubIcon from '../../assets/icons/GithubIcon';
import TwitterIcon from '../../assets/icons/TwitterIcon'; 
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            faydonk.dev
          </div>
          <div className="footer-center">
            <a href="/terms" className="footer-link">Terms</a>
          </div>
            <div className="footer-social">
            <a href="https://github.com/faydonk" className="social-link" target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="footer-icon" />
            </a>
            <a href="https://twitter.com/faydonkwin" className="social-link" target="_blank" rel="noopener noreferrer">
              <TwitterIcon className="footer-icon" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;