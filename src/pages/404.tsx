import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './404.css';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();

  return (
    <>
      <Header />
      <div className="not-found-page">
        <div style={{ height: '71px' }}></div>
        <section id="card">
          <h1>{t('notFound.title')}</h1>
          <p className="error-message">{t('notFound.message')}</p>
          <p><a href={`/${lang || 'en'}`}>{t('notFound.returnHome')}</a></p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;