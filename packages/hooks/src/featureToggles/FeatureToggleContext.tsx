import { type ReactNode, createContext, useEffect, useState } from "react";

import { useSyncPointsTypeFeature } from "../usePointsTypeFeature";
import {
  type FeatureToggleState,
  areFeatureToggleStatesEqual,
  getDefaultFeatureToggleState,
  syncFeatureTogglesToStorage,
} from "./featureToggleUtils";
import type { FeatureToggleStorage } from "./types";

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
        setToggles((current) =>
          areFeatureToggleStatesEqual(current, syncedToggles) ? current : syncedToggles,
        );
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
