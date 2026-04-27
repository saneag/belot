import { useState } from "react";

import { useColorScheme } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { LocalizationContextProvider } from "@belot/localizations";

import { ColorModeContextProvider, ColorModeContextType } from "@/components/colorModeContext";
import Navigation from "@/components/navigation";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

import { getDeviceLanguage } from "@/helpers/localization";
import "@/styles/global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const [colorMode, setColorMode] = useState<ColorModeContextType["colorMode"]>(
    systemColorScheme === "dark" ? "dark" : "light",
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationContextProvider getDeviceLanguage={getDeviceLanguage}>
        <SafeAreaProvider>
          <ColorModeContextProvider colorMode={colorMode} setColorMode={setColorMode}>
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
          </ColorModeContextProvider>
        </SafeAreaProvider>
      </LocalizationContextProvider>
    </QueryClientProvider>
  );
}
