import { useContext } from "react";

import { FeatureToggleContext } from "./FeatureToggleContext";
import { isKnownFeatureToggle, logUnknownFeatureToggle } from "./featureToggleUtils";

export const useFeatureToggle = (name: string): boolean => {
  const toggles = useContext(FeatureToggleContext);

  if (!isKnownFeatureToggle(name)) {
    logUnknownFeatureToggle(name);
    return false;
  }

  return toggles[name];
};
