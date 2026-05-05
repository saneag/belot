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
  const callbacksRef = useRef({
    getItemFromStorage,
    isVisible,
    setItemsToStorage,
    subscribeToVisibilityChange,
  });
  const startTimeRef = useRef<number>(0);

  const [timeSpent, setTimeSpent] = useState(0);

  const hours = Math.floor(timeSpent / 3600);
  const minutes = Math.floor((timeSpent % 3600) / 60);
  const seconds = timeSpent % 60;
  const shouldPadSeconds = hours > 0 || minutes > 0;

  useEffect(() => {
    callbacksRef.current = {
      getItemFromStorage,
      isVisible,
      setItemsToStorage,
      subscribeToVisibilityChange,
    };
  }, [getItemFromStorage, isVisible, setItemsToStorage, subscribeToVisibilityChange]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const updateTime = () => {
      if (startTimeRef.current <= 0) {
        return;
      }

      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

      setTimeSpent((currentTimeSpent) =>
        currentTimeSpent === elapsedSeconds ? currentTimeSpent : elapsedSeconds,
      );
    };

    const scheduleNextTick = () => {
      if (!isMounted || startTimeRef.current <= 0) {
        return;
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const elapsedMilliseconds = Date.now() - startTimeRef.current;
      const nextSecond =
        elapsedMilliseconds <= 0 ? 1000 : (Math.floor(elapsedMilliseconds / 1000) + 1) * 1000;
      const delay = Math.max(50, nextSecond - elapsedMilliseconds);

      timeoutId = setTimeout(() => {
        updateTime();
        scheduleNextTick();
      }, delay);
    };

    const initializeTimer = async () => {
      const { getItemFromStorage, setItemsToStorage } = callbacksRef.current;
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
      scheduleNextTick();
    };

    const handleVisibilityChange = () => {
      if (callbacksRef.current.isVisible()) {
        updateTime();
        scheduleNextTick();
      }
    };

    void initializeTimer();

    const unsubscribe = callbacksRef.current.subscribeToVisibilityChange(handleVisibilityChange);

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      unsubscribe();
    };
  }, []);

  return {
    hours,
    minutes,
    seconds,
    shouldPadSeconds,
  };
};
