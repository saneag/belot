import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { ThemeContextProvider } from "@belot/components";
import { LocalizationContextProvider } from "@belot/localizations";

import { FeatureToggleProvider } from "@/components/featureToggles/FeatureToggleProvider";
import { Layout } from "@/components/_layout";
import PhoneScreen from "@/components/phoneScreen";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { getDeviceLanguage } from "@/helpers/localization";
import { readInitialTheme } from "@/helpers/themeHelpers";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationContextProvider getDeviceLanguage={getDeviceLanguage}>
        <FeatureToggleProvider>
          <ThemeContextProvider initialTheme={readInitialTheme()}>
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
          </ThemeContextProvider>
        </FeatureToggleProvider>
      </LocalizationContextProvider>
    </QueryClientProvider>
  );
}

export default App;
