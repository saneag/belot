import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ro from './ro.json';
import ru from './ru.json';

export type TranslationKeys = keyof typeof en;

const getDeviceLanguage = (): string => {
  const locales = getLocales();
  return locales[0].languageTag || 'en';
};

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: {
      translation: en,
    },
    ro: {
      translation: ro,
    },
    ru: {
      translation: ru,
    },
  },
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const i18nLocale = i18n;
