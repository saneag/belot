import { useContext } from "react";

import { isKnownFeatureToggle, logUnknownFeatureToggle } from "./featureToggleUtils";
import { FeatureToggleContext } from "./toggleContext";

export const useFeatureToggle = (name: string): boolean => {
  const toggles = useContext(FeatureToggleContext);

  if (!isKnownFeatureToggle(name)) {
    logUnknownFeatureToggle(name);
    return false;
  }

  return toggles[name] ?? false;
};
