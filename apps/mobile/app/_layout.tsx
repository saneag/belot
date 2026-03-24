import { useState } from "react";

import { useColorScheme } from "react-native";

import { I18nextProvider } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { ColorModeContextProvider, ColorModeContextType } from "@/components/colorModeContext";
import Navigation from "@/components/navigation";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

import "@/styles/global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "i18next";

const queryClient = new QueryClient();

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const [colorMode, setColorMode] = useState<ColorModeContextType["colorMode"]>(
    systemColorScheme === "dark" ? "dark" : "light",
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ColorModeContextProvider colorMode={colorMode} setColorMode={setColorMode}>
          <I18nextProvider i18n={i18n}>
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
          </I18nextProvider>
        </ColorModeContextProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
