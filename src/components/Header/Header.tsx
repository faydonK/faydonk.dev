import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLanguageChange = () => {
    const newLang = currentLanguage === 'en' ? 'fr' : 'en';
    changeLanguage(newLang);
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <a className="nav-brand" href={`/${currentLanguage}#`}>
            faydonk.dev
          </a>
          
          <div className="nav-center desktop-only">
            <a href="mailto:hello@faydonk.dev" className="nav-email">
              hello@faydonk.dev
            </a>
          </div>
          <div className="nav-links desktop-only">
            <a href="#about" className="nav-link">{t('nav.about')}</a>
            <a href="#skills" className="nav-link">{t('nav.skills')}</a>
            <a href="#projects" className="nav-link">{t('nav.projects')}</a>
            <button 
              onClick={handleLanguageChange}
              className="lang-switcher"
              title="Change language"
            >
              <Globe size={18} />
              <span>{currentLanguage === 'en' ? 'FR' : 'EN'}</span>
            </button>
          </div>

          <button className="mobile-menu-button mobile-only" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`mobile-nav ${isMenuOpen ? 'mobile-nav-open' : ''}`}>
            <a href="mailto:hello@faydonk.dev" className="nav-email mobile-nav-item" onClick={closeMenu}>
              hello@faydonk.dev
            </a>
            <a href="#about" className="nav-link mobile-nav-item" onClick={closeMenu}>{t('nav.about')}</a>
            <a href="#skills" className="nav-link mobile-nav-item" onClick={closeMenu}>{t('nav.skills')}</a>
            <a href="#projects" className="nav-link mobile-nav-item" onClick={closeMenu}>{t('nav.projects')}</a>
            <button 
              onClick={() => { handleLanguageChange(); closeMenu(); }}
              className="lang-switcher mobile-nav-item"
            >
              <Globe size={18} />
              <span>{currentLanguage === 'en' ? 'FR' : 'EN'}</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;