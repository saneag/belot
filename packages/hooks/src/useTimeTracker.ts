import { useEffect, useRef, useState } from "react";

import { StorageKeys } from "@belot/constants";

export interface UseTimeTrackerProps {
  getItemFromStorage: (key: StorageKeys) => Promise<string | null> | string | null;
  setItemsToStorage: (items: Partial<Record<StorageKeys, string>>) => Promise<void> | void;
  isVisible: () => boolean;
  subscribeToVisibilityChange: (handleVisibilityChange: () => void) => () => void;
}

export const useTimeTracker = ({
  getItemFromStorage,
  setItemsToStorage,
  isVisible,
  subscribeToVisibilityChange,
}: UseTimeTrackerProps) => {
  const startTimeRef = useRef<number>(0);

  const [timeSpent, setTimeSpent] = useState(0);

  const hours = Math.floor(timeSpent / 3600);
  const minutes = Math.floor((timeSpent % 3600) / 60);
  const seconds = timeSpent % 60;
  const shouldPadSeconds = hours > 0 || minutes > 0;

  useEffect(() => {
    let isMounted = true;

    const updateTime = () => {
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

      setTimeSpent(elapsedSeconds);
    };

    const initializeTimer = async () => {
      const storageStartTime = await getItemFromStorage(StorageKeys.timerStartTime);
      const parsedStorageStartTime = storageStartTime ? Number(storageStartTime) : NaN;
      const hasValidStorageStartTime =
        Number.isFinite(parsedStorageStartTime) && parsedStorageStartTime > 0;
      const startTime = hasValidStorageStartTime ? parsedStorageStartTime : Date.now();

      if (!hasValidStorageStartTime) {
        await setItemsToStorage({ [StorageKeys.timerStartTime]: String(startTime) });
      }

      if (!isMounted) {
        return;
      }

      startTimeRef.current = startTime;
      updateTime();
    };

    const handleVisibilityChange = () => {
      if (isVisible()) {
        updateTime();
      }
    };

    void initializeTimer();

    const intervalId = setInterval(updateTime, 1000);
    const unsubscribe = subscribeToVisibilityChange(handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      unsubscribe();
    };
  }, [getItemFromStorage, isVisible, setItemsToStorage, subscribeToVisibilityChange]);

  return {
    hours,
    minutes,
    seconds,
    shouldPadSeconds,
  };
};
