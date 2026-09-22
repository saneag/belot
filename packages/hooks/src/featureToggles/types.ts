import type { StorageKeys } from "@belot/constants";

export interface FeatureToggleStorage {
  getFromStorage: (key: StorageKeys) => Promise<string | null> | string | null;
  setToStorage: (key: StorageKeys, value: string) => Promise<void> | void;
}

export interface FeatureToggleRemoteState {
  fetchGlobalToggles?: () => Promise<Record<string, boolean>>;
  updateGlobalToggle?: (name: string, enabled: boolean) => Promise<void>;
  userId?: string;
}
