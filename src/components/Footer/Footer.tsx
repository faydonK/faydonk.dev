import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import { useMailPicker } from '../MailPicker/MailPickerContext';
import { SITE } from '../../data/site';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const openMail = useMailPicker();

  return (
    <footer className="footer">
      <div className="footer__inner container">
        <p className="footer__kicker">{t('footer.kicker')}</p>
        <a className="footer__email" href={`mailto:${SITE.email}`} onClick={openMail}>
          {SITE.email}
        </a>

        <div className="footer__links">
          {SITE.socials.map((social) => (
            <a
              key={social.url}
              className="btn btn--quiet btn--small"
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">[</span>
              {social.label}
              <span aria-hidden="true">]</span>
            </a>
          ))}
        </div>

        <div className="footer__bar">
          <span>
            {SITE.name} © {new Date().getFullYear()}
          </span>
          <Link className="footer__terms" to={`/${currentLanguage}/terms`}>
            {t('footer.terms')}
          </Link>
          <span>{t('footer.end')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
