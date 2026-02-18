import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext } from "react";

import { PlayersNamesValidation } from "@belot/types";

interface PlayersSelectionContextType {
  validations: PlayersNamesValidation;
  setValidations: Dispatch<SetStateAction<PlayersNamesValidation>>;
  resetValidations: VoidFunction;
}

const PlayersSelectionContext = createContext<PlayersSelectionContextType>({
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

interface PlayersSelectionContextProps extends PlayersSelectionContextType, PropsWithChildren {}

export const PlayersSelectionContextProvider = ({
  children,
  ...rest
}: PlayersSelectionContextProps) => {
  return (
    <PlayersSelectionContext.Provider value={rest}>{children}</PlayersSelectionContext.Provider>
  );
};
