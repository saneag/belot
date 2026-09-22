import { Suspense } from "react";

import { Outlet } from "react-router-dom";

import { LocalizationContextProvider } from "@belot/localizations";

import { Layout } from "@/components/_layout";
import { FeatureToggleProvider } from "@/components/featureToggles/FeatureToggleProvider";
import PhoneScreen from "@/components/phoneScreen";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { getDeviceLanguage } from "@/helpers/localization";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationContextProvider getDeviceLanguage={getDeviceLanguage}>
        <FeatureToggleProvider>
          <Layout>
            <TooltipProvider>
              <PhoneScreen>
                <Suspense>
                  <Outlet />
                </Suspense>
                <Toaster />
              </PhoneScreen>
            </TooltipProvider>
          </Layout>
        </FeatureToggleProvider>
      </LocalizationContextProvider>
    </QueryClientProvider>
  );
}

export default App;
