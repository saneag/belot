import type { ReactNode } from "react";

import { FeatureToggleProvider as SharedFeatureToggleProvider } from "@belot/hooks";

import { getFromStorage, setToStorage } from "@/helpers/storageHelpers";

interface FeatureToggleProviderProps {
  children: ReactNode;
}

export const FeatureToggleProvider = ({ children }: FeatureToggleProviderProps) => (
  <SharedFeatureToggleProvider getFromStorage={getFromStorage} setToStorage={setToStorage}>
    {children}
  </SharedFeatureToggleProvider>
);
