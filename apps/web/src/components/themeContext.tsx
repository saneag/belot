import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { THEMES } from "@belot/constants";

export interface ThemeContextType {
  theme: THEMES;
  setTheme: Dispatch<SetStateAction<THEMES>>;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES.light,
  setTheme: () => {},
});

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeContextProvider");
  }

  return context;
};

interface ThemeContextProps extends PropsWithChildren {}

export const ThemeContextProvider = ({ children }: ThemeContextProps) => {
  const [theme, setTheme] = useState<THEMES>(THEMES.light);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as THEMES | null;

    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const dark = savedTheme === THEMES.dark || (!savedTheme && systemPrefersDark);

    const finalTheme = dark ? THEMES.dark : THEMES.light;

    document.documentElement.classList.add(finalTheme);

    setTheme(dark ? THEMES.dark : THEMES.light);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
