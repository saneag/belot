import { useCallback, useState } from "react";

import type { PlayersNamesValidation } from "@belot/types";

import ActionButtons from "@/components/players-selection/actionButtons";
import LoadPreviousGameButton from "@/components/players-selection/loadPreviousGameButton";
import PlayersCount from "@/components/players-selection/playersCount";
import PlayersNames from "@/components/players-selection/playersNames";
import { PlayersSelectionContextProvider } from "@/components/players-selection/playersSelectionContext";

import { useLoadPreviousGame } from "@/hooks/players-selection/useLoadPreviousGame";
import { useLocalization } from "@/localizations/useLocalization";

export default function PlayersSelectionPage() {
  const playersSetupMsg = useLocalization("players.setup");

  const [validations, setValidations] = useState<PlayersNamesValidation>({
    emptyNames: [],
    repeatingNames: [],
  });

  const resetValidations = useCallback(() => {
    setValidations({
      emptyNames: [],
      repeatingNames: [],
    });
  }, []);

  useLoadPreviousGame();

  return (
    <div className="flex h-full flex-1 items-center justify-center px-2.5">
      <div className="flex flex-col gap-5">
        <h1 className="text-center text-4xl font-normal">{playersSetupMsg}</h1>

        <div className="flex flex-col gap-5">
          <PlayersSelectionContextProvider
            validations={validations}
            setValidations={setValidations}
            resetValidations={resetValidations}
          >
            <PlayersCount />
            <PlayersNames />

            <ActionButtons />
          </PlayersSelectionContextProvider>
          <LoadPreviousGameButton />
        </div>
      </div>
    </div>
  );
}
