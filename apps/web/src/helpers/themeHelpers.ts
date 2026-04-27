import { StorageKeys, THEMES } from "@belot/constants";

export const readInitialTheme = (): THEMES => {
  const savedTheme = localStorage.getItem(StorageKeys.theme) as THEMES | null;
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = savedTheme === THEMES.dark || (!savedTheme && systemPrefersDark);
  const initial = dark ? THEMES.dark : THEMES.light;
  document.documentElement.classList.add(initial);
  return initial;
};
