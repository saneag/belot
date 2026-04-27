import { Outlet } from "react-router-dom";

import { LocalizationContextProvider } from "@belot/localizations";

import { Layout } from "@/components/_layout";
import PhoneScreen from "@/components/phoneScreen";
import { ThemeContextProvider } from "@/components/themeContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { getDeviceLanguage } from "@/helpers/localization";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationContextProvider getDeviceLanguage={getDeviceLanguage}>
        <ThemeContextProvider>
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
