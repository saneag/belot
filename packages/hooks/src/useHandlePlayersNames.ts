import { useCallback, useMemo } from "react";

import { useGameStore } from "@belot/store";
import type { Player } from "@belot/types";
import { isPlayerNameValid } from "@belot/utils";

import { usePlayersSelectionContext } from "./usePlayersSelectionContext";

interface UseHandlePlayersNamesProps {
  player: Player;
}

export const useHandlePlayersNames = ({ player }: UseHandlePlayersNamesProps) => {
  const { validations, resetValidations } = usePlayersSelectionContext();
  const updatePlayer = useGameStore((state) => state.updatePlayer);

  const isInvalid = useMemo(
    () => !isPlayerNameValid(validations, player.id),
    [player.id, validations],
  );

  const handlePlayerNameChange = useCallback(
    (value: string) => {
      updatePlayer(player.id, {
        name: value,
      });
      resetValidations();
    },
    [player.id, resetValidations, updatePlayer],
  );

  return {
    isInvalid,
    handlePlayerNameChange,
  };
};
