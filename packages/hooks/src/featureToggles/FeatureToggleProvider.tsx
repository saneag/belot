import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { type FeatureToggleName, StorageKeys } from "@belot/constants";

import { useSyncPointsTypeFeature } from "../usePointsTypeFeature";
import {
  type FeatureToggleState,
  areFeatureToggleStatesEqual,
  getDefaultFeatureToggleState,
  serializeFeatureToggleState,
  syncFeatureTogglesToStorage,
} from "./featureToggleUtils";
import { FeatureToggleContext } from "./toggleContext";
import type { FeatureToggleStorage } from "./types";

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

  const setFeatureToggle = useCallback(
    async (name: FeatureToggleName, enabled: boolean) => {
      const nextToggles = {
        ...toggles,
        [name]: enabled,
      };

      setToggles(nextToggles);
      await setToStorage(StorageKeys.featureToggles, serializeFeatureToggleState(nextToggles));
    },
    [setToStorage, toggles],
  );

  const contextValue = useMemo(
    () => ({
      toggles,
      setFeatureToggle,
    }),
    [setFeatureToggle, toggles],
  );

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
    <FeatureToggleContext.Provider value={contextValue}>
      <PointsTypeFeatureSync />
      {children}
    </FeatureToggleContext.Provider>
  );
};
