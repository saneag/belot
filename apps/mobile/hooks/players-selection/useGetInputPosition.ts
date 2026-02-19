import { usePlayersSelectionContext } from "@/components/players-selection/playersSelectionContext";

import { getRightPosition, getTopPosition } from "@/helpers/playerNamesHelpers";

export const useGetInputPosition = () => {
  const { validations } = usePlayersSelectionContext();

  const isError = validations.emptyNames.length > 0 || validations.repeatingNames.length > 0;

  return {
    getTopPosition: (index: number, playersCount: number) =>
      getTopPosition(index, playersCount, isError),
    getRightPosition: (index: number, playersCount: number) =>
      getRightPosition(index, playersCount, isError),
  };
};
