import type { ElementType } from "react";

import { type UseTimeTrackerProps, useTimeTracker } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";

interface TimeTrackerProps extends UseTimeTrackerProps {
  textWrapper: ElementType;
  textWrapperClassName?: string;
}

export const TimeTracker = ({
  textWrapper: TextWrapper,
  textWrapperClassName,
  ...rest
}: TimeTrackerProps) => {
  const timeMsg = useLocalization("time");

  const { hours, minutes, seconds, shouldPadSeconds } = useTimeTracker(rest);

  return (
    <TextWrapper className={textWrapperClassName}>
      {timeMsg}: {hours > 0 && hours.toString().padStart(2, "0") + ":"}
      {(hours > 0 || minutes > 0) && minutes.toString().padStart(2, "0") + ":"}
      {shouldPadSeconds ? seconds.toString().padStart(2, "0") : seconds}
    </TextWrapper>
  );
};
