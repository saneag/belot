import { ReactElement, cloneElement, isValidElement, useState } from "react";

import { InterfaceTooltipProps } from "@gluestack-ui/core/lib/esm/tooltip/creator/types";

import { Tooltip, TooltipContent, TooltipText } from "./ui/tooltip";

interface ButtonWithTooltipProps {
  tooltipProps?: Omit<InterfaceTooltipProps, "trigger">;
  tooltipText: string;
  tooltipTextClassName?: string;
  button: ReactElement<Record<string, any>>;
}

export default function ExtendedTooltip({
  tooltipProps,
  tooltipText,
  tooltipTextClassName,
  button,
}: ButtonWithTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleTooltipVisibility = (isVisible: boolean) => {
    setIsVisible(isVisible);
  };

  return (
    <Tooltip
      isOpen={isVisible}
      placement="top"
      shouldOverlapWithTrigger
      trigger={(triggerProps) =>
        isValidElement(button)
          ? cloneElement(button, {
              ...triggerProps,
              ...button.props,
              onPress: () => {
                button.props.onPress?.();
                triggerProps.onPress?.();
              },
              onLongPress: () => {
                handleTooltipVisibility(true);
                button.props.onLongPress?.();
                triggerProps.onLongPress?.();
              },
              onPressOut: () => {
                handleTooltipVisibility(false);
                button.props.onPressOut?.();
                triggerProps.onPressOut?.();
              },
            })
          : null
      }
      {...tooltipProps}
    >
      <TooltipContent>
        <TooltipText className={tooltipTextClassName}>{tooltipText}</TooltipText>
      </TooltipContent>
    </Tooltip>
  );
}
