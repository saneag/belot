import { initReactI18next } from "react-i18next";

import { Localizations } from "@belot/localizations";

import i18n from "i18next";

export type TranslationKeys = keyof typeof Localizations.en;

const getLocales = () => {
  if (navigator.languages !== undefined) return navigator.languages[0];
  return navigator.language;
};

const getDeviceLanguage = (): string => {
  return getLocales() || "en";
};

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    en: {
      translation: Localizations.en,
    },
    ro: {
      translation: Localizations.ro,
    },
    ru: {
      translation: Localizations.ru,
    },
  },
  lng: getDeviceLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export const i18nLocale = i18n;
