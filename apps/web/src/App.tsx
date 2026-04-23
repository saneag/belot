import { Outlet } from "react-router-dom";

import { Layout } from "@/components/_layout";
import PhoneScreen from "@/components/phoneScreen";
import { ThemeContextProvider } from "@/components/themeContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
