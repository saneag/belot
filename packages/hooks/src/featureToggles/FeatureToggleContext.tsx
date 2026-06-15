import { createContext, useEffect, useState, type ReactNode } from "react";

import {
  getDefaultFeatureToggleState,
  syncFeatureTogglesToStorage,
  type FeatureToggleState,
} from "./featureToggleUtils";
import type { FeatureToggleStorage } from "./types";
import { useSyncPointsTypeFeature } from "../usePointsTypeFeature";

export const FeatureToggleContext = createContext<FeatureToggleState>(
  getDefaultFeatureToggleState(),
);

interface FeatureToggleProviderProps extends FeatureToggleStorage {
  children: ReactNode;
}

const PointsTypeFeatureSync = () => {
  useSyncPointsTypeFeature();
  return null;
};

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
    <FeatureToggleContext.Provider value={toggles}>
      <PointsTypeFeatureSync />
      {children}
    </FeatureToggleContext.Provider>
  );
};
