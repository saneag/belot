import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { type FeatureToggleName, StorageKeys } from "@belot/constants";

import { useSyncPointsTypeFeature } from "../usePointsTypeFeature";
import {
  type FeatureToggleState,
  areFeatureToggleStatesEqual,
  getDefaultFeatureToggleState,
  syncFeatureTogglesToStorage,
} from "./featureToggleUtils";
import { FeatureToggleContext } from "./toggleContext";
import type { FeatureToggleRemoteState, FeatureToggleStorage } from "./types";

interface FeatureToggleProviderProps extends FeatureToggleStorage, FeatureToggleRemoteState {
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
  fetchGlobalToggles,
  updateGlobalToggle,
  userId,
}: FeatureToggleProviderProps) => {
  const [toggles, setToggles] = useState<Record<string, boolean>>(getDefaultFeatureToggleState);

  const setFeatureToggle = useCallback(
    async (name: FeatureToggleName, enabled: boolean) => {
      if (updateGlobalToggle) await updateGlobalToggle(name, enabled);
      const nextToggles = {
        ...toggles,
        [name]: enabled,
      };

      setToggles(nextToggles);
      await setToStorage(StorageKeys.featureToggles, JSON.stringify(nextToggles));
    },
    [setToStorage, toggles, updateGlobalToggle],
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

      let nextToggles: Record<string, boolean> = syncedToggles;
      if (fetchGlobalToggles) {
        try {
          nextToggles = await fetchGlobalToggles();
          await setToStorage(StorageKeys.featureToggles, JSON.stringify(nextToggles));
        } catch {
          // The cached state initialized above is the offline fallback.
        }
      }
      if (userId) {
        const rawOverrides = await getFromStorage(StorageKeys.featureToggleOverrides);
        try {
          const allOverrides = rawOverrides
            ? (JSON.parse(rawOverrides) as Record<string, Record<string, boolean | null>>)
            : {};
          const overrides = allOverrides[userId] ?? {};
          nextToggles = Object.fromEntries(
            Object.entries(nextToggles).map(([name, value]) => [name, overrides[name] ?? value]),
          );
        } catch {
          /* ignore malformed local overrides */
        }
      }
      if (!isCancelled) {
        setToggles((current) =>
          areFeatureToggleStatesEqual(
            current as FeatureToggleState,
            nextToggles as FeatureToggleState,
          )
            ? current
            : nextToggles,
        );
      }
    };

    void initializeFeatureToggles();

    return () => {
      isCancelled = true;
    };
  }, [fetchGlobalToggles, getFromStorage, setToStorage, userId]);

  return (
    <FeatureToggleContext.Provider value={contextValue}>
      <PointsTypeFeatureSync />
      {children}
    </FeatureToggleContext.Provider>
  );
};
