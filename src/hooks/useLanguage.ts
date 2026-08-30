import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export type SupportedLanguage = 'en' | 'fr';

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'fr'];
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

const isSupportedLanguage = (value: string | undefined): value is SupportedLanguage =>
  value !== undefined && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);

export const useLanguage = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLanguage = isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;

  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const changeLanguage = (newLang: SupportedLanguage) => {
    if (newLang === currentLanguage) return;

    const segments = location.pathname.split('/').filter(Boolean);
    if (isSupportedLanguage(segments[0])) {
      segments[0] = newLang;
    } else {
      segments.unshift(newLang);
    }

    navigate(`/${segments.join('/')}`);
  };

  return {
    currentLanguage,
    changeLanguage,
  };
};
