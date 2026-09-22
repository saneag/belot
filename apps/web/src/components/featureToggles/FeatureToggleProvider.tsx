import type { ReactNode } from "react";

import { getFeatureToggles, updateFeatureToggle } from "@belot/api-client";
import { FeatureToggleProvider as SharedFeatureToggleProvider } from "@belot/hooks";

import { useAuth } from "@/auth/authContext";
import { getApiBaseUrl } from "@/helpers/apiBaseUrl";
import { getFromStorage, setToStorage } from "@/helpers/storageHelpers";

interface FeatureToggleProviderProps {
  children: ReactNode;
}

export const FeatureToggleProvider = ({ children }: FeatureToggleProviderProps) => {
  const { user } = useAuth();
  return (
    <SharedFeatureToggleProvider
      getFromStorage={getFromStorage}
      setToStorage={setToStorage}
      userId={user?.id}
      fetchGlobalToggles={async () =>
        Object.fromEntries(
          (await getFeatureToggles(getApiBaseUrl())).map((toggle) => [toggle.name, toggle.enabled]),
        )
      }
      updateGlobalToggle={async (name, enabled) => {
        await updateFeatureToggle(getApiBaseUrl(), name, enabled);
      }}
    >
      {children}
    </SharedFeatureToggleProvider>
  );
};
