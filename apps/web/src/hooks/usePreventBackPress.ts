import { useLayoutEffect } from "react";

export const usePreventBackPress = (onBackPressCallback: () => undefined) => {
  useLayoutEffect(() => {
    window.addEventListener("popstate", onBackPressCallback);

    return () => {
      window.removeEventListener("popstate", onBackPressCallback);
    };
  }, [onBackPressCallback]);
};
