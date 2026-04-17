import { useCallback, useLayoutEffect } from "react";

export const usePreventBackPress = (showConfirmationDialog?: VoidFunction) => {
  useLayoutEffect(
    useCallback(() => {
      const onBackPress = () => {
        showConfirmationDialog?.();
        return true;
      };

      window.addEventListener("popstate", onBackPress);

      return () => {
        window.removeEventListener("popstate", onBackPress);
      };
    }, [showConfirmationDialog]),
  );
};
