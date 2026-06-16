export const FEATURE_TOGGLES = {
  "settings-screen": false,
  "backend-game-init": false,
  "points-type": false,
} as const;

export type FeatureToggleName = keyof typeof FEATURE_TOGGLES;
