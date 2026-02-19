import { useEffect, useRef, useState } from "react";

import { AppState } from "react-native";

import { Text } from "@/components/ui/text";

import { useLocalization } from "@/localizations/useLocalization";

export default function TimeTracker() {
  const timeMsg = useLocalization("time");

  const startTimeRef = useRef<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  const hours = Math.floor(timeSpent / 3600);
  const minutes = Math.floor((timeSpent % 3600) / 60);
  const seconds = timeSpent % 60;

  useEffect(() => {
    const updateTime = () => {
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

      setTimeSpent(elapsedSeconds);
    };

    const intervalId = setInterval(updateTime, 1000);

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        updateTime();
      }
    });

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, []);

  return (
    <Text>
      {timeMsg}: {hours > 0 && hours.toString().padStart(2, "0") + ":"}
      {(hours > 0 || minutes > 0) && minutes.toString().padStart(2, "0") + ":"}
      {seconds.toString().padStart(2, "0")}
    </Text>
  );
}
