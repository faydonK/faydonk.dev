import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import fr from '../locales/fr.json';

export const SUPPORTED_LANGUAGES = ['en', 'fr'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = { en: 'English', fr: 'Français' };

export const isSupportedLanguage = (value: string | undefined): value is SupportedLanguage =>
  SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);

const languageFromUrl = (): SupportedLanguage => { // first paint (loader included) already translated
  const segment = window.location.pathname.split('/')[1];
  return isSupportedLanguage(segment) ? segment : DEFAULT_LANGUAGE;
};

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language; // screen readers, hyphenation
});

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: languageFromUrl(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
