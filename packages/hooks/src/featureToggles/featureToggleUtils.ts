import {
  FEATURE_TOGGLES,
  StorageKeys,
  type FeatureToggleName,
} from "@belot/constants";

import type { FeatureToggleStorage } from "./types";

export type FeatureToggleState = Record<FeatureToggleName, boolean>;

export const getDefaultFeatureToggleState = (): FeatureToggleState => ({
  ...FEATURE_TOGGLES,
});

export const isKnownFeatureToggle = (name: string): name is FeatureToggleName =>
  Object.hasOwn(FEATURE_TOGGLES, name);

export const logUnknownFeatureToggle = (name: string): void => {
  console.error(
    `[FeatureToggle] Unknown feature toggle "${name}". Add it to FEATURE_TOGGLES in @belot/constants. Feature will be hidden.`,
  );
};

export const syncFeatureTogglesToStorage = async ({
  getFromStorage,
  setToStorage,
}: FeatureToggleStorage): Promise<FeatureToggleState> => {
  const centralizedState = getDefaultFeatureToggleState();
  const storedValue = await getFromStorage(StorageKeys.featureToggles);

  if (storedValue === JSON.stringify(centralizedState)) {
    return centralizedState;
  }

  await setToStorage(StorageKeys.featureToggles, JSON.stringify(centralizedState));
  return centralizedState;
};
