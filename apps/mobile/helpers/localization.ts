import { getLocales } from "expo-localization";

export const getDeviceLanguage = (): string => {
  const locales = getLocales();
  return locales[0].languageTag || "en";
};
