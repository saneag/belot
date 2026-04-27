import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { ThemeContextProvider } from "@belot/components";
import { LocalizationContextProvider } from "@belot/localizations";

import Navigation from "@/components/navigation";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

import { getDeviceLanguage } from "@/helpers/localization";
import { useReadInitialTheme } from "@/hooks/useReadInitialTheme";
import "@/styles/global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { theme } = useReadInitialTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationContextProvider getDeviceLanguage={getDeviceLanguage}>
        <SafeAreaProvider>
          <ThemeContextProvider initialTheme={theme}>
            <GluestackUIProvider mode="system">
              <SafeAreaView className="flex-1">
                <KeyboardAwareScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  enableOnAndroid
                  keyboardShouldPersistTaps="handled"
                >
                  <Navigation />
                </KeyboardAwareScrollView>
              </SafeAreaView>
            </GluestackUIProvider>
          </ThemeContextProvider>
        </SafeAreaProvider>
      </LocalizationContextProvider>
    </QueryClientProvider>
  );
}
