import { FEATURE_TOGGLES, type FeatureToggleName, StorageKeys } from "@belot/constants";

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

export const needsFeatureToggleStorageSync = (storedValue: string | null): boolean => {
  const storedToggles = parseStoredFeatureToggles(storedValue);

  if (!storedToggles) {
    return true;
  }

  // Only sync when storage is missing a toggle that exists in code (new toggle added)
  return FEATURE_TOGGLE_NAMES.some((name) => storedToggles[name] === undefined);
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
  const storedToggles = parseStoredFeatureToggles(storedValue) ?? {};

  // Stored values override code defaults; code defaults fill in any missing toggles
  const mergedState: FeatureToggleState = { ...centralizedState, ...storedToggles };

  if (needsFeatureToggleStorageSync(storedValue)) {
    await setToStorage(StorageKeys.featureToggles, serializeFeatureToggleState(mergedState));
  }

  return mergedState;
};
