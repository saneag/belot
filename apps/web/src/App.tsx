import { Outlet } from "react-router-dom";

import PhoneScreen from "@/components/phone-screen";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen items-center justify-center">
        <TooltipProvider>
          <PhoneScreen>
            <Outlet />
            <Toaster />
          </PhoneScreen>
        </TooltipProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;
