import { type Dispatch, type SetStateAction, createContext, useContext } from "react";

import type { PlayersNamesValidation } from "@belot/types";

export interface PlayersSelectionContextType {
  validations: PlayersNamesValidation;
  setValidations: Dispatch<SetStateAction<PlayersNamesValidation>>;
  resetValidations: VoidFunction;
}

export const PlayersSelectionContext = createContext<PlayersSelectionContextType>({
  validations: {
    emptyNames: [],
    repeatingNames: [],
  },
  setValidations: () => {},
  resetValidations: () => {},
});

export const usePlayersSelectionContext = () => {
  const context = useContext(PlayersSelectionContext);

  if (context === undefined) {
    throw new Error(
      "usePlayersSelectionContext must be used within a PlayersSelectionContextProvider",
    );
  }

  return context;
};
