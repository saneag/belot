export const FEATURE_TOGGLES = {
  "user-authentication": true,
  "settings-screen": false,
  "backend-game-init": false,
  "points-type": false,
  "max-score-selector": false,
} as const;

export type FeatureToggleName = keyof typeof FEATURE_TOGGLES;
