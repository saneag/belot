import { initReactI18next } from "react-i18next";

import { getLocales } from "expo-localization";

import { Localizations } from "@belot/localizations";

import i18n from "i18next";

export type TranslationKeys = keyof typeof Localizations.en;

const getDeviceLanguage = (): string => {
  const locales = getLocales();
  return locales[0].languageTag || "en";
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
