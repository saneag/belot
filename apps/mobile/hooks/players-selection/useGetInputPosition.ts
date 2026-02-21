import { isPlayerNameValid } from "@belot/utils";

import { usePlayersSelectionContext } from "@/components/players-selection/playersSelectionContext";

import { getRightPosition, getTopPosition } from "@/helpers/playerNamesHelpers";

export const useGetInputPosition = () => {
  const { validations } = usePlayersSelectionContext();

  return {
    getTopPosition: (index: number, playersCount: number) =>
      getTopPosition(index, playersCount, !isPlayerNameValid(validations, index)),
    getRightPosition: (index: number, playersCount: number) =>
      getRightPosition(index, playersCount, !isPlayerNameValid(validations, index)),
  };
};
