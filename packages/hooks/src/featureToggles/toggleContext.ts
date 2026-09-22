import { createContext } from "react";

import type { FeatureToggleName } from "@belot/constants";

import { getDefaultFeatureToggleState } from "./featureToggleUtils";

export interface FeatureToggleContextValue {
  toggles: Record<string, boolean>;
  setFeatureToggle: (name: FeatureToggleName, enabled: boolean) => Promise<void>;
}

const noopSetFeatureToggle: FeatureToggleContextValue["setFeatureToggle"] = () => Promise.resolve();

export const FeatureToggleContext = createContext<FeatureToggleContextValue>({
  toggles: getDefaultFeatureToggleState(),
  setFeatureToggle: noopSetFeatureToggle,
});
