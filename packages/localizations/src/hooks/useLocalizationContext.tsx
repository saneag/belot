import { createContext, useContext } from "react";

interface LocalizationContextType {
  getDeviceLanguage: () => string;
}

export const LocalizationContext = createContext<LocalizationContextType>({
  getDeviceLanguage: () => "en",
});

export const useLocalizationContext = () => {
  const context = useContext(LocalizationContext);

  if (context === undefined) {
    throw new Error("useLocalizationContext must be used within a LocalizationContextProvider");
  }

  return context;
};
