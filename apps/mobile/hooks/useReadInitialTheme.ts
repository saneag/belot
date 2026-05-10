import { useCallback, useState } from "react";

import { useColorScheme } from "react-native";

import { useFocusEffect } from "expo-router";

import { StorageKeys, THEMES } from "@belot/constants";

import { getFromStorage } from "@/helpers/storageHelpers";

export const useReadInitialTheme = () => {
  const systemColorScheme = useColorScheme();

  const [theme, setTheme] = useState<THEMES>(THEMES.light);

  const readInitialTheme = useCallback(async () => {
    const savedTheme = (await getFromStorage(StorageKeys.theme)) as THEMES | null;
    const dark = savedTheme === THEMES.dark || (!savedTheme && systemColorScheme === "dark");
    const initial = dark ? THEMES.dark : THEMES.light;
    setTheme(initial);
  }, [systemColorScheme]);

  useFocusEffect(
    useCallback(() => {
      readInitialTheme();
    }, [readInitialTheme]),
  );

  return { theme };
};
