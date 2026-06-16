import {
  FEATURE_TOGGLES,
  StorageKeys,
  type FeatureToggleName,
} from "@belot/constants";

import type { FeatureToggleStorage } from "./types";

export type FeatureToggleState = Record<FeatureToggleName, boolean>;

const FEATURE_TOGGLE_NAMES = Object.keys(FEATURE_TOGGLES) as FeatureToggleName[];

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

export const serializeFeatureToggleState = (state: FeatureToggleState): string =>
  JSON.stringify(
    FEATURE_TOGGLE_NAMES.reduce<FeatureToggleState>((serializedState, name) => {
      serializedState[name] = state[name];
      return serializedState;
    }, {} as FeatureToggleState),
  );

export const parseStoredFeatureToggles = (
  storedValue: string | null,
): Partial<FeatureToggleState> | null => {
  if (!storedValue) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(storedValue);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const storedRecord = parsed as Record<string, unknown>;
    const parsedToggles: Partial<FeatureToggleState> = {};

    FEATURE_TOGGLE_NAMES.forEach((name) => {
      const value = storedRecord[name];

      if (typeof value === "boolean") {
        parsedToggles[name] = value;
      }
    });

    return parsedToggles;
  } catch {
    return null;
  }
};

export const needsFeatureToggleStorageSync = (
  storedValue: string | null,
  centralizedState: FeatureToggleState,
): boolean => {
  const storedToggles = parseStoredFeatureToggles(storedValue);

  if (!storedToggles) {
    return true;
  }

  return FEATURE_TOGGLE_NAMES.some((name) => storedToggles[name] !== centralizedState[name]);
};

export const areFeatureToggleStatesEqual = (
  left: FeatureToggleState,
  right: FeatureToggleState,
): boolean => FEATURE_TOGGLE_NAMES.every((name) => left[name] === right[name]);

export const syncFeatureTogglesToStorage = async ({
  getFromStorage,
  setToStorage,
}: FeatureToggleStorage): Promise<FeatureToggleState> => {
  const centralizedState = getDefaultFeatureToggleState();
  const storedValue = await getFromStorage(StorageKeys.featureToggles);

  if (needsFeatureToggleStorageSync(storedValue, centralizedState)) {
    await setToStorage(
      StorageKeys.featureToggles,
      serializeFeatureToggleState(centralizedState),
    );
  }

  return centralizedState;
};
