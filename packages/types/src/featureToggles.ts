export interface FeatureToggle {
  name: string;
  enabled: boolean;
}

export type LocalFeatureToggleOverride = "on" | "off" | "clear";
