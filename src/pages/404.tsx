import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Corners from '../components/Corners/Corners';
import { useLanguage } from '../hooks/useLanguage';
import './404.css';

const NotFound = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <section className="not-found container" aria-labelledby="not-found-title">
      <div className="not-found__frame">
        <Corners />
        <p className="not-found__kicker">{t('notFound.kicker')}</p>
        <h1 id="not-found-title" className="not-found__code">
          {t('notFound.title')}
        </h1>
        <p className="not-found__message">{t('notFound.message')}</p>
        <Link className="btn" to={`/${currentLanguage}`}>
          {t('notFound.returnHome')}
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
