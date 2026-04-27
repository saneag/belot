import { type Dispatch, type SetStateAction, createContext, useContext } from "react";

import type { THEMES } from "@belot/constants";

export interface ThemeContextType {
  theme: THEMES;
  setTheme: Dispatch<SetStateAction<THEMES>>;
  initialTheme: THEMES;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeContextProvider");
  }

  return context;
};
