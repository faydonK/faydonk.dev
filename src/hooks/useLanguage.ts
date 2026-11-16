import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  type SupportedLanguage,
} from '../utils/i18n';

export const useLanguage = () => {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isSupported = isSupportedLanguage(lang);
  const currentLanguage: SupportedLanguage = isSupported ? lang : DEFAULT_LANGUAGE;

  const changeLanguage = (newLang: SupportedLanguage) => {
    if (newLang === currentLanguage) return;

    const segments = location.pathname.split('/').filter(Boolean);
    if (isSupportedLanguage(segments[0])) {
      segments[0] = newLang;
    } else {
      segments.unshift(newLang);
    }

    navigate(`/${segments.join('/')}${location.hash}`);
  };

  return { currentLanguage, isSupported, changeLanguage };
};

export const useLanguageSync = (language: SupportedLanguage) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);
};
