import type { PropsWithChildren } from "react";

import { LocalizationContext } from "../hooks/useLocalizationContext";

interface LocalizationContextProviderProps extends PropsWithChildren {
  getDeviceLanguage: () => string;
}

export const LocalizationContextProvider = ({
  children,
  getDeviceLanguage,
}: LocalizationContextProviderProps) => {
  return (
    <LocalizationContext.Provider value={{ getDeviceLanguage }}>
      {children}
    </LocalizationContext.Provider>
  );
};
