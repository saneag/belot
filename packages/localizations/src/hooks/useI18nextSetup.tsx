import { useEffect } from "react";

import { initReactI18next } from "react-i18next";

import i18next from "i18next";

import { SUPPORTED_LANGUAGES } from "../constants";
import { Localizations } from "../localizations";
import { useLocalizationContext } from "./useLocalizationContext";

const resolveLanguage = (language: string) => {
  const normalizedLanguage = language.toLowerCase().split("-")[0];

  return SUPPORTED_LANGUAGES.includes(normalizedLanguage as (typeof SUPPORTED_LANGUAGES)[number])
    ? normalizedLanguage
    : "en";
};

if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
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
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
}

export const useI18nextSetup = () => {
  const { getDeviceLanguage } = useLocalizationContext();
  const language = resolveLanguage(getDeviceLanguage());

  useEffect(() => {
    if (i18next.resolvedLanguage !== language) {
      void i18next.changeLanguage(language);
    }
  }, [language]);

  return i18next;
};
