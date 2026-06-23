import { useCallback, useEffect, useReducer, useRef } from "react";

import { POINTS_TYPE, StorageKeys } from "@belot/constants";

interface UseSettings {
  getFromStorage: (key: StorageKeys) => Promise<string | null> | string | null;
  setToStorage: (key: StorageKeys, value: string) => Promise<void> | void;
}

export interface Settings {
  pointsType: string;
}

const initialSettings: Settings = {
  pointsType: POINTS_TYPE[0].id,
};

const settingsReducer = (
  state: typeof initialSettings,
  newSettings: Partial<typeof initialSettings>,
) => {
  return {
    ...state,
    ...newSettings,
  };
};

export const useSettings = ({ getFromStorage, setToStorage }: UseSettings) => {
  const [settings, setSettings] = useReducer(settingsReducer, initialSettings);
  const settingsRef = useRef(settings);
  const storageRequestIdRef = useRef(0);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const getSettingsFromLocalStorage = useCallback(async () => {
    const requestId = ++storageRequestIdRef.current;
    const settingsFromStorage = await getFromStorage(StorageKeys.settings);

    if (!settingsFromStorage || requestId !== storageRequestIdRef.current) {
      return;
    }

    const parsedSettings = JSON.parse(settingsFromStorage) as Settings;

    if (settingsRef.current.pointsType === parsedSettings.pointsType) {
      return;
    }

    settingsRef.current = parsedSettings;
    setSettings(parsedSettings);
  }, [getFromStorage]);

  const setSettingsToLocalStorage = useCallback(
    async (newSettings: Partial<Settings>) => {
      const hasChanges = Object.entries(newSettings).some(
        ([key, value]) => settingsRef.current[key as keyof Settings] !== value,
      );

      if (!hasChanges) {
        return;
      }

      storageRequestIdRef.current += 1;
      const updatedSettings = {
        ...settingsRef.current,
        ...newSettings,
      };

      settingsRef.current = updatedSettings;
      setSettings(newSettings);
      await setToStorage(StorageKeys.settings, JSON.stringify(updatedSettings));
    },
    [setToStorage],
  );

  return {
    settings,
    getSettingsFromLocalStorage,
    setSettings: setSettingsToLocalStorage,
  };
};
