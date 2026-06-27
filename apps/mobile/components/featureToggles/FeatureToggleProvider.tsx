import type { ReactNode } from "react";

import { getFeatureToggles } from "@belot/api-client";
import { FeatureToggleProvider as SharedFeatureToggleProvider } from "@belot/hooks";

import { getApiBaseUrl } from "@/helpers/apiBaseUrl";
import { getFromStorage, setToStorage } from "@/helpers/storageHelpers";

interface FeatureToggleProviderProps {
  children: ReactNode;
}

const fetchRemoteFeatureToggles = () => getFeatureToggles(getApiBaseUrl());

export const FeatureToggleProvider = ({ children }: FeatureToggleProviderProps) => (
  <SharedFeatureToggleProvider
    fetchRemoteFeatureToggles={fetchRemoteFeatureToggles}
    getFromStorage={getFromStorage}
    setToStorage={setToStorage}
  >
    {children}
  </SharedFeatureToggleProvider>
);
