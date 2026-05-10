import { AppState } from "react-native";

export const subscribeToVisibilityChange = (handleVisibilityChange: () => void) => {
  const subscription = AppState.addEventListener("change", (state) => {
    if (state === "active") {
      handleVisibilityChange();
    }
  });

  return () => {
    subscription.remove();
  };
};
