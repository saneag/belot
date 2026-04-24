import { useLayoutEffect } from "react";

export const usePreventBackPress = (showConfirmationDialog?: () => void) => {
  useLayoutEffect(() => {
    const onBackPress = () => {
      showConfirmationDialog?.();
      return true;
    };

    window.addEventListener("popstate", onBackPress);

    return () => {
      window.removeEventListener("popstate", onBackPress);
    };
  }, [showConfirmationDialog]);
};
