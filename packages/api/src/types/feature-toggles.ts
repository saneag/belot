import type { FeatureToggleName } from "@belot/constants";

export type ApiFeatureToggle = {
  name: FeatureToggleName;
  enabled: boolean;
};

export type FeatureTogglesResponse = {
  toggles: ApiFeatureToggle[];
};
