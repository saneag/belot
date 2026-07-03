import type { StorageKeys } from "@belot/constants";

export interface FeatureToggleStorage {
  getFromStorage: (key: StorageKeys) => Promise<string | null> | string | null;
  setToStorage: (key: StorageKeys, value: string) => Promise<void> | void;
}

export type RemoteFeatureToggle = {
  name: string;
  enabled: boolean;
};

export type RemoteFeatureTogglesResponse = {
  toggles: RemoteFeatureToggle[];
};

export type RemoteFeatureToggleFetcher = () => Promise<RemoteFeatureTogglesResponse>;
