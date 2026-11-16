import aircodesLogo from '../assets/images/aircodes-logo.webp';
import type { SupportedLanguage } from '../utils/i18n';

type Translated = Record<SupportedLanguage, string>;

export interface Project {
  id: string;
  name: string;
  logo?: string;
  url: string;
  linkLabel: string;
  description: Translated;
  summary?: Translated;
}

export const PROJECTS: Project[] = [
  {
    id: 'aircodes',
    name: 'AirCodes',
    logo: aircodesLogo,
    url: 'https://github.com/faydonK/AirCodes',
    linkLabel: 'github.com',
    description: {
      en: 'An open-source, community-focused platform designed for everyone. Members earn coins through participation and unlock exclusive rewards in the community-run shop.',
      fr: 'Une plateforme open source pensée pour la communauté et ouverte à tous. Les membres gagnent des coins en participant et débloquent des récompenses exclusives dans la boutique gérée par la communauté.',
    },
    summary: {
      en: 'Open-source community platform with a coin system and a community-run rewards shop.',
      fr: 'Plateforme communautaire open source avec un système de coins et une boutique de récompenses gérée par la communauté.',
    },
  },
];
