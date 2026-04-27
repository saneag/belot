import { useEffect, useRef, useState } from "react";

import { StorageKeys } from "@belot/constants";
import { useLocalization } from "@belot/localizations";

export default function TimeTracker() {
  const timeMsg = useLocalization("time");

  const startTimeRef = useRef<number>(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const hours = Math.floor(timeSpent / 3600);
  const minutes = Math.floor((timeSpent % 3600) / 60);
  const seconds = timeSpent % 60;
  const shouldPadSeconds = hours > 0 || minutes > 0;

  useEffect(() => {
    const updateTime = () => {
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

      setTimeSpent(elapsedSeconds);
    };

    const storageStartTime = localStorage.getItem(StorageKeys.timerStartTime);
    const parsedStorageStartTime = storageStartTime ? Number(storageStartTime) : NaN;
    const hasValidStorageStartTime =
      Number.isFinite(parsedStorageStartTime) && parsedStorageStartTime > 0;
    const startTime = hasValidStorageStartTime ? parsedStorageStartTime : Date.now();

    if (!hasValidStorageStartTime) {
      localStorage.setItem(StorageKeys.timerStartTime, String(startTime));
    }

    startTimeRef.current = startTime;
    updateTime();

    const intervalId = setInterval(updateTime, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateTime();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <span className="justify-self-end">
      {timeMsg}: {hours > 0 && hours.toString().padStart(2, "0") + ":"}
      {(hours > 0 || minutes > 0) && minutes.toString().padStart(2, "0") + ":"}
      {shouldPadSeconds ? seconds.toString().padStart(2, "0") : seconds}
    </span>
  );
}
