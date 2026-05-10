import { Outlet } from "react-router-dom";

import { ThemeContextProvider } from "@belot/components";
import { LocalizationContextProvider } from "@belot/localizations";

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
        <ThemeContextProvider initialTheme={readInitialTheme()}>
          <Layout>
            <TooltipProvider>
              <PhoneScreen>
                <Outlet />
                <Toaster />
              </PhoneScreen>
            </TooltipProvider>
          </Layout>
        </ThemeContextProvider>
      </LocalizationContextProvider>
    </QueryClientProvider>
  );
}

export default App;
