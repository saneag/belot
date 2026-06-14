import { createContext, useEffect, useState, type ReactNode } from "react";

import {
  getDefaultFeatureToggleState,
  syncFeatureTogglesToStorage,
  type FeatureToggleState,
} from "./featureToggleUtils";
import type { FeatureToggleStorage } from "./types";

export const FeatureToggleContext = createContext<FeatureToggleState>(
  getDefaultFeatureToggleState(),
);

interface FeatureToggleProviderProps extends FeatureToggleStorage {
  children: ReactNode;
}

export const FeatureToggleProvider = ({
  children,
  getFromStorage,
  setToStorage,
}: FeatureToggleProviderProps) => {
  const [toggles, setToggles] = useState<FeatureToggleState>(getDefaultFeatureToggleState);

  useEffect(() => {
    let isCancelled = false;

    const initializeFeatureToggles = async () => {
      const syncedToggles = await syncFeatureTogglesToStorage({
        getFromStorage,
        setToStorage,
      });

      if (!isCancelled) {
        setToggles(syncedToggles);
      }
    };

    void initializeFeatureToggles();

    return () => {
      isCancelled = true;
    };
  }, [getFromStorage, setToStorage]);

  return (
    <FeatureToggleContext.Provider value={toggles}>{children}</FeatureToggleContext.Provider>
  );
};
