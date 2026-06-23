import { createContext } from "react";

import type { FeatureToggleName } from "@belot/constants";

import { type FeatureToggleState, getDefaultFeatureToggleState } from "./featureToggleUtils";

export interface FeatureToggleContextValue {
  toggles: FeatureToggleState;
  setFeatureToggle: (name: FeatureToggleName, enabled: boolean) => Promise<void>;
}

const noopSetFeatureToggle: FeatureToggleContextValue["setFeatureToggle"] = () => Promise.resolve();

export const FeatureToggleContext = createContext<FeatureToggleContextValue>({
  toggles: getDefaultFeatureToggleState(),
  setFeatureToggle: noopSetFeatureToggle,
});
