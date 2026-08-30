import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import './Terms.css';

const Terms: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();

  return (
    <>
      <div className="terms-page">
        <div style={{ height: '71px' }}></div>
        <div className="container">
          <div className="terms-content">
            <h1>{t('terms.title')}</h1>
            
            <section>
              <h2>{t('terms.hosting.title')}</h2>
              <p>
                {t('terms.hosting.content')}
              </p>
            </section>
            
            <section>
              <h2>{t('terms.content.title')}</h2>
              <p>
                {t('terms.content.text')}
              </p>
            </section>
            
            <section>
              <h2>{t('terms.privacy.title')}</h2>
              <p>
                {t('terms.privacy.text')} <a href="https://vercel.com/legal/privacy-policy">{t('terms.privacy.link')}</a> {t('terms.privacy.textEnd')}
              </p>
            </section>
            
            <section>
              <h2>{t('terms.contact.title')}</h2>
              <p>
                {t('terms.contact.text')} <a href="mailto:hello@faydonk.dev">hello@faydonk.dev</a>
              </p>
            </section>
            
            <a href={`/${lang || 'en'}`} className="back-link">{t('terms.backHome')}</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;