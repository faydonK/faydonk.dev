import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <a className="nav-brand" href="/#">
            faydonk.dev
          </a>
          
          <div className="nav-center desktop-only">
            <a href="mailto:hello@faydonk.dev" className="nav-email">
              hello@faydonk.dev
            </a>
          </div>
          <div className="nav-links desktop-only">
            <a href="#about" className="nav-link">About</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#projects" className="nav-link">Projects</a>
          </div>

          <button className="mobile-menu-button mobile-only" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`mobile-nav ${isMenuOpen ? 'mobile-nav-open' : ''}`}>
            <a href="mailto:hello@faydonk.dev" className="nav-email mobile-nav-item" onClick={closeMenu}>
              hello@faydonk.dev
            </a>
            <a href="#about" className="nav-link mobile-nav-item" onClick={closeMenu}>About</a>
            <a href="#skills" className="nav-link mobile-nav-item" onClick={closeMenu}>Skills</a>
            <a href="#projects" className="nav-link mobile-nav-item" onClick={closeMenu}>Projects</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;