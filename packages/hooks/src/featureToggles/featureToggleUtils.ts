import { FEATURE_TOGGLES, type FeatureToggleName, StorageKeys } from "@belot/constants";

import type {
  FeatureToggleStorage,
  RemoteFeatureToggleFetcher,
  RemoteFeatureTogglesResponse,
} from "./types";

export type FeatureToggleState = Record<FeatureToggleName, boolean>;
export type PartialFeatureToggleState = Partial<FeatureToggleState>;

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

export const serializeFeatureToggleState = (state: PartialFeatureToggleState): string =>
  JSON.stringify(
    FEATURE_TOGGLE_NAMES.reduce<PartialFeatureToggleState>((serializedState, name) => {
      if (typeof state[name] === "boolean") {
        serializedState[name] = state[name];
      }
      return serializedState;
    }, {}),
  );

export const parseStoredFeatureToggles = (
  storedValue: string | null,
): PartialFeatureToggleState | null => {
  if (!storedValue) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(storedValue);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const storedRecord = parsed as Record<string, unknown>;
    const parsedToggles: PartialFeatureToggleState = {};

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

export const parseRemoteFeatureToggles = (
  response: RemoteFeatureTogglesResponse,
): PartialFeatureToggleState => {
  const remoteToggles: PartialFeatureToggleState = {};

  if (!Array.isArray(response.toggles)) {
    return remoteToggles;
  }

  response.toggles.forEach(({ name, enabled }) => {
    if (isKnownFeatureToggle(name) && typeof enabled === "boolean") {
      remoteToggles[name] = enabled;
    }
  });

  return remoteToggles;
};

export const needsFeatureToggleStorageSync = (storedValue: string | null): boolean =>
  parseStoredFeatureToggles(storedValue) === null;

export const areFeatureToggleStatesEqual = (
  left: FeatureToggleState,
  right: FeatureToggleState,
): boolean => FEATURE_TOGGLE_NAMES.every((name) => left[name] === right[name]);

export const arePartialFeatureToggleStatesEqual = (
  left: PartialFeatureToggleState,
  right: PartialFeatureToggleState,
): boolean => FEATURE_TOGGLE_NAMES.every((name) => left[name] === right[name]);

export const getEffectiveFeatureToggleState = (
  remoteToggles: PartialFeatureToggleState,
  localOverrides: PartialFeatureToggleState,
): FeatureToggleState => ({
  ...getDefaultFeatureToggleState(),
  ...remoteToggles,
  ...localOverrides,
});

export const removeOverridesMatchingRemote = (
  localOverrides: PartialFeatureToggleState,
  remoteToggles: PartialFeatureToggleState,
): PartialFeatureToggleState => {
  const nextOverrides: PartialFeatureToggleState = {};

  FEATURE_TOGGLE_NAMES.forEach((name) => {
    const override = localOverrides[name];

    if (typeof override !== "boolean") {
      return;
    }

    const remoteValue = remoteToggles[name] ?? FEATURE_TOGGLES[name];
    if (override !== remoteValue) {
      nextOverrides[name] = override;
    }
  });

  return nextOverrides;
};

export const syncFeatureTogglesToStorage = async ({
  getFromStorage,
  setToStorage,
  fetchRemoteFeatureToggles,
}: FeatureToggleStorage & {
  fetchRemoteFeatureToggles?: RemoteFeatureToggleFetcher;
}): Promise<{
  toggles: FeatureToggleState;
  remoteToggles: PartialFeatureToggleState;
  localOverrides: PartialFeatureToggleState;
}> => {
  const [cachedRemoteValue, localOverridesValue] = await Promise.all([
    getFromStorage(StorageKeys.remoteFeatureToggles),
    getFromStorage(StorageKeys.featureToggles),
  ]);

  let remoteToggles = parseStoredFeatureToggles(cachedRemoteValue) ?? {};

  if (fetchRemoteFeatureToggles) {
    try {
      remoteToggles = parseRemoteFeatureToggles(await fetchRemoteFeatureToggles());
      await setToStorage(
        StorageKeys.remoteFeatureToggles,
        serializeFeatureToggleState(remoteToggles),
      );
    } catch {
      // Cached remote toggles keep the app usable when the endpoint is unavailable.
    }
  }

  const storedLocalOverrides = parseStoredFeatureToggles(localOverridesValue) ?? {};
  const localOverrides = removeOverridesMatchingRemote(storedLocalOverrides, remoteToggles);

  if (!arePartialFeatureToggleStatesEqual(storedLocalOverrides, localOverrides)) {
    await setToStorage(StorageKeys.featureToggles, serializeFeatureToggleState(localOverrides));
  }

  return {
    toggles: getEffectiveFeatureToggleState(remoteToggles, localOverrides),
    remoteToggles,
    localOverrides,
  };
};
