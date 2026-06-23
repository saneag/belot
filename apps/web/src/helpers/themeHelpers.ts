import { StorageKeys, THEMES } from "@belot/constants";

import { getFromStorage } from "@/helpers/storageHelpers";

export const readInitialTheme = (): THEMES => {
  const savedTheme = getFromStorage(StorageKeys.theme) as THEMES | null;
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = savedTheme === THEMES.dark || (!savedTheme && systemPrefersDark);
  const initial = dark ? THEMES.dark : THEMES.light;
  document.documentElement.classList.add(initial);
  return initial;
};
