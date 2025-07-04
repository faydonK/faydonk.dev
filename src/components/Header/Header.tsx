import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <a className="nav-brand" href="/#">
            faydonk.dev
          </a>
          <div className="nav-center">
            <a href="mailto:hello@faydonk.dev" className="nav-email">
              hello@faydonk.dev
            </a>
          </div>
          <div className="nav-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#projects" className="nav-link">Projects</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;