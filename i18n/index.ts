import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import ja from './locales/ja';
import ar from './locales/ar';

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
] as const;

export type LanguageCode = typeof LANGUAGES[number]['code'];

// Get device language, fall back to 'en'
const getDeviceLanguage = (): LanguageCode => {
  const locale = Localization.getLocales()?.[0]?.languageCode || 'en';
  const supported = LANGUAGES.map(l => l.code);
  return (supported.includes(locale as LanguageCode) ? locale : 'en') as LanguageCode;
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    ja: { translation: ja },
    ar: { translation: ar },
  },
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
