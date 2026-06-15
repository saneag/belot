import { useCallback, useEffect } from "react";

import { useBlocker, type Blocker } from "react-router-dom";

export const usePreventBackPress = (onBackPressCallback: () => void): Blocker => {
  const shouldBlock = useCallback(
    ({ historyAction }: { historyAction: string }) => historyAction === "POP",
    [],
  );

  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state === "blocked") {
      onBackPressCallback();
    }
  }, [blocker.state, onBackPressCallback]);

  return blocker;
};
