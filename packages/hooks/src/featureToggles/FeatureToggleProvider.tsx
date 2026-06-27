import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { FEATURE_TOGGLES, type FeatureToggleName, StorageKeys } from "@belot/constants";

import { useSyncPointsTypeFeature } from "../usePointsTypeFeature";
import {
  type FeatureToggleState,
  type PartialFeatureToggleState,
  areFeatureToggleStatesEqual,
  arePartialFeatureToggleStatesEqual,
  getDefaultFeatureToggleState,
  getEffectiveFeatureToggleState,
  serializeFeatureToggleState,
  syncFeatureTogglesToStorage,
} from "./featureToggleUtils";
import { FeatureToggleContext } from "./toggleContext";
import type { FeatureToggleStorage, RemoteFeatureToggleFetcher } from "./types";

interface FeatureToggleProviderProps extends FeatureToggleStorage {
  children: ReactNode;
  fetchRemoteFeatureToggles?: RemoteFeatureToggleFetcher;
}

const PointsTypeFeatureSync = () => {
  useSyncPointsTypeFeature();
  return null;
};

export const FeatureToggleProvider = ({
  children,
  fetchRemoteFeatureToggles,
  getFromStorage,
  setToStorage,
}: FeatureToggleProviderProps) => {
  const [toggles, setToggles] = useState<FeatureToggleState>(getDefaultFeatureToggleState);
  const [remoteToggles, setRemoteToggles] = useState<PartialFeatureToggleState>({});
  const [localOverrides, setLocalOverrides] = useState<PartialFeatureToggleState>({});

  const setFeatureToggle = useCallback(
    async (name: FeatureToggleName, enabled: boolean) => {
      const nextOverrides = { ...localOverrides };
      const remoteValue = remoteToggles[name] ?? FEATURE_TOGGLES[name];

      if (enabled === remoteValue) {
        delete nextOverrides[name];
      } else {
        nextOverrides[name] = enabled;
      }

      const nextToggles = getEffectiveFeatureToggleState(remoteToggles, nextOverrides);

      setLocalOverrides(nextOverrides);
      setToggles(nextToggles);
      await setToStorage(StorageKeys.featureToggles, serializeFeatureToggleState(nextOverrides));
    },
    [localOverrides, remoteToggles, setToStorage],
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
      const synced = await syncFeatureTogglesToStorage({
        fetchRemoteFeatureToggles,
        getFromStorage,
        setToStorage,
      });

      if (!isCancelled) {
        setRemoteToggles((current) =>
          arePartialFeatureToggleStatesEqual(current, synced.remoteToggles)
            ? current
            : synced.remoteToggles,
        );
        setLocalOverrides((current) =>
          arePartialFeatureToggleStatesEqual(current, synced.localOverrides)
            ? current
            : synced.localOverrides,
        );
        setToggles((current) =>
          areFeatureToggleStatesEqual(current, synced.toggles) ? current : synced.toggles,
        );
      }
    };

    void initializeFeatureToggles();

    return () => {
      isCancelled = true;
    };
  }, [fetchRemoteFeatureToggles, getFromStorage, setToStorage]);

  return (
    <FeatureToggleContext.Provider value={contextValue}>
      <PointsTypeFeatureSync />
      {children}
    </FeatureToggleContext.Provider>
  );
};
