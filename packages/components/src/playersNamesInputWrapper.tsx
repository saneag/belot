import type { ElementType, ReactNode } from "react";

import { useGetInputPosition } from "@belot/hooks";

interface PlayersNamesInputWrapperProps {
  children: ReactNode;
  blockWrapper: ElementType;
  index: number;
  playersCount: number;
}

export const PlayersNamesInputWrapper = ({
  children,
  blockWrapper: BlockWrapper,
  index,
  playersCount,
}: PlayersNamesInputWrapperProps) => {
  const { getRightPosition, getTopPosition, getRotation } = useGetInputPosition();

  return (
    <BlockWrapper
      className="absolute"
      style={{
        top: getTopPosition(index, playersCount),
        right: getRightPosition(index, playersCount),
        transform: getRotation(index, playersCount),
      }}
    >
      {children}
    </BlockWrapper>
  );
};
