import React, { useEffect } from "react";

import { ColorSchemeName, View, ViewProps } from "react-native";

import * as SystemUI from "expo-system-ui";

import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";
import { ToastProvider } from "@gluestack-ui/core/toast/creator";
import { colorScheme as colorSchemeNW, useColorScheme } from "nativewind";

import { config } from "./config";

type ModeType = "light" | "dark" | "system";

const getColorSchemeName = (colorScheme: ColorSchemeName, mode: ModeType): "light" | "dark" => {
  if (mode === "system") {
    return colorScheme ?? "light";
  }
  return mode;
};

const ROOT_BACKGROUND = {
  light: "#ffffff",
  dark: "#121212",
} as const;

export function GluestackUIProvider({
  mode = "light",
  ...props
}: {
  mode?: "light" | "dark" | "system";
  children?: React.ReactNode;
  style?: ViewProps["style"];
}) {
  const colorScheme = useColorScheme();

  const colorSchemeName = getColorSchemeName(colorScheme.colorScheme, mode);

  useEffect(() => {
    colorSchemeNW.set(colorSchemeName);
  }, [colorSchemeName]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(ROOT_BACKGROUND[colorSchemeName]);
  }, [colorSchemeName]);

  return (
    <View
      style={[
        config[colorSchemeName],
        { flex: 1, backgroundColor: ROOT_BACKGROUND[colorSchemeName] },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
