import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageMenu from '../LanguageMenu/LanguageMenu';
import { useLanguage } from '../../hooks/useLanguage';
import { SITE } from '../../data/site';
import './Header.css';

const SECTIONS = ['about', 'skills', 'projects'] as const;

const Header = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const home = `/${currentLanguage}`;

  return (
    <header className="header container">
      <Link className="header__brand" to={{ pathname: home, hash: '#top' }}>
        <span className="header__logo" aria-hidden="true">
          <svg className="header__logo-arc" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="13" />
          </svg>
          <svg className="header__logo-sight" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="10" />
            <path d="M15 2v6M15 22v6M2 15h6M22 15h6" />
          </svg>
        </span>
        {SITE.domain}
      </Link>

      <span className="header__tag">[ {SITE.email} ]</span>

      <nav className="header__nav" aria-label={t('nav.label')}>
        {SECTIONS.map((section) => (
          <Link key={section} className="btn btn--bare" to={{ pathname: home, hash: `#${section}` }}>
            <span aria-hidden="true">[</span>
            {t(`nav.${section}`)}
            <span aria-hidden="true">]</span>
          </Link>
        ))}
        <LanguageMenu />
      </nav>
    </header>
  );
};

export default Header;
