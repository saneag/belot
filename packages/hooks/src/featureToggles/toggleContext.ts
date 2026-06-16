import { createContext } from "react";

import { type FeatureToggleState, getDefaultFeatureToggleState } from "./featureToggleUtils";

export const FeatureToggleContext = createContext<FeatureToggleState>(
  getDefaultFeatureToggleState(),
);
