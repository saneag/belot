const getLocales = () => {
  if (navigator.languages !== undefined) return navigator.languages[0];
  return navigator.language;
};

export const getDeviceLanguage = (): string => {
  return getLocales() || "en";
};
