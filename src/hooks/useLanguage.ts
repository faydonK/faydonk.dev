import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (lang && (lang === 'en' || lang === 'fr')) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  }, [lang, i18n]);

  const changeLanguage = (newLang: 'en' | 'fr') => {
    if (newLang === lang) return;
    
    // Remove the current language from the path
    const pathWithoutLang = location.pathname.replace(`/${lang}`, '');
    navigate(`/${newLang}${pathWithoutLang}`);
  };

  return {
    currentLanguage: (lang || 'en') as 'en' | 'fr',
    changeLanguage,
  };
};
