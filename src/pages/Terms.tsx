import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Corners from '../components/Corners/Corners';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import { useMailPicker } from '../components/MailPicker/MailPickerContext';
import { useLanguage } from '../hooks/useLanguage';
import { SITE } from '../data/site';
import './Terms.css';

const Terms = () => {
  const { t } = useTranslation();
  const openMail = useMailPicker();
  const { currentLanguage } = useLanguage();

  return (
    <section className="terms container" aria-labelledby="terms-title">
      <div className="terms__frame">
        <Corners />
        <SectionHeading as="h1" id="terms-title" kicker={t('terms.kicker')} title={t('terms.title')} />

        <div className="terms__blocks">
          <section className="terms__block">
            <h2>{t('terms.hosting.title')}</h2>
            <p>{t('terms.hosting.content')}</p>
          </section>

          <section className="terms__block">
            <h2>{t('terms.content.title')}</h2>
            <p>{t('terms.content.text')}</p>
          </section>

          <section className="terms__block">
            <h2>{t('terms.privacy.title')}</h2>
            <p>
              {t('terms.privacy.text')}{' '}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                {t('terms.privacy.link')}
              </a>{' '}
              {t('terms.privacy.textEnd')}
            </p>
          </section>

          <section className="terms__block">
            <h2>{t('terms.contact.title')}</h2>
            <p>
              {t('terms.contact.text')} <a href={`mailto:${SITE.email}`} onClick={openMail}>
                {SITE.email}
              </a>
            </p>
          </section>
        </div>

        <Link className="btn terms__back" to={`/${currentLanguage}`}>
          {t('terms.backHome')}
        </Link>
      </div>
    </section>
  );
};

export default Terms;
