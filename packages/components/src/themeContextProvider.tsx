import { type PropsWithChildren, useMemo, useState } from "react";

import { THEMES } from "@belot/constants";
import { ThemeContext } from "@belot/hooks";

interface ThemeContextProps extends PropsWithChildren {
  initialTheme: THEMES;
}

export const ThemeContextProvider = ({ children, initialTheme }: ThemeContextProps) => {
  const [theme, setTheme] = useState<THEMES>(initialTheme);

  const value = useMemo(() => ({ theme, setTheme, initialTheme }), [theme, initialTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
