export const FEATURE_TOGGLES = {
  "settings-screen": false,
  "backend-game-init": false,
} as const;

export type FeatureToggleName = keyof typeof FEATURE_TOGGLES;
