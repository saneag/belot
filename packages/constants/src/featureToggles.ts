export const FEATURE_TOGGLES = {
  "settings-screen": false,
} as const;

export type FeatureToggleName = keyof typeof FEATURE_TOGGLES;
