import type { GetRightPositionProps, GetTopPositionProps } from "@belot/types";
import { getRightPosition, getRotation, getTopPosition, isPlayerNameValid } from "@belot/utils";

import { usePlayersSelectionContext } from "./usePlayersSelectionContext";

type TypesToOmit = "index" | "playersCount" | "isError";

interface UseGetInputPositionProps
  extends Omit<GetTopPositionProps, TypesToOmit>, Omit<GetRightPositionProps, TypesToOmit> {}

export const useGetInputPosition = (props: UseGetInputPositionProps = {}) => {
  const { validations } = usePlayersSelectionContext();

  return {
    getTopPosition: (index: number, playersCount: number) =>
      getTopPosition({
        index,
        playersCount,
        isError: !isPlayerNameValid(validations, index),
        ...props,
      }),
    getRightPosition: (index: number, playersCount: number) =>
      getRightPosition({
        index,
        playersCount,
        isError: !isPlayerNameValid(validations, index),
        ...props,
      }),
    getRotation: (index: number, playersCount: number, isObjectRotation?: boolean) =>
      getRotation({ index, playersCount, isObjectRotation }),
  };
};
