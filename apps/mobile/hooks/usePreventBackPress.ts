import { useCallback } from "react";

import { BackHandler } from "react-native";

import { useFocusEffect } from "expo-router";

export const usePreventBackPress = (onBackPressCallback: () => undefined) => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        onBackPressCallback();
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => subscription.remove();
    }, [onBackPressCallback]),
  );
};
