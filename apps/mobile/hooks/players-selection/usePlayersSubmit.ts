import { useCallback } from "react";

import { useRouter } from "expo-router";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { isPlayerNameValid, validatePlayersNames } from "@belot/utils";

import { usePlayersSelectionContext } from "@/components/players-selection/playersSelectionContext";

import { setMultipleItemsToStorage } from "@/helpers/storageHelpers";

export default function usePlayersSubmit() {
  const router = useRouter();
  const { setValidations } = usePlayersSelectionContext();

  const players = useGameStore((state) => state.players);
  const setEmptyRoundScore = useGameStore((state) => state.setEmptyRoundScore);

  const handleOpenDialog = useCallback(
    (showDialog: VoidFunction) => {
      const validation = validatePlayersNames(players);

      setValidations(validation);

      if (!isPlayerNameValid(validation)) {
        return;
      }

      showDialog();
    },
    [players, setValidations],
  );

  const handleSubmit = useCallback(async () => {
    const validation = validatePlayersNames(players);

    setValidations(validation);

    if (!isPlayerNameValid(validation)) {
      return;
    }

    await setMultipleItemsToStorage({
      [StorageKeys.players]: players,
      [StorageKeys.hasPreviousGame]: true,
    });

    setEmptyRoundScore();

    router.navigate("/game-table");
  }, [players, router, setEmptyRoundScore, setValidations]);

  return {
    handleOpenDialog,
    handleSubmit,
  };
}
